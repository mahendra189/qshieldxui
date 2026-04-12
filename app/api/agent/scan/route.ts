import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const targetId = payload.targetId || "TGT-UNKNOWN";

    const client = await clientPromise;
    const db = client.db('cyb_dashboard');

    // Fetch the target to get the domain
    let targetDoc: any = null;
    try {
      targetDoc = await db.collection('targets').findOne({
        $or: [
          { id: targetId },
          { _id: targetId },
          { _id: new ObjectId(targetId) }
        ]
      });
    } catch (e) {
      targetDoc = await db.collection('targets').findOne({ id: targetId });
    }

    const targetDomain = targetDoc?.domain || targetDoc?.primaryDomain || targetDoc?.name || "example.com";
    console.log(`>>> PROXYING AGENT SCAN FOR DOMAIN: [${targetDomain}] (TargetID: ${targetId})`);

    // Query the external agent backend using the new pipeline endpoint
    const agentResponse = await fetch("http://127.0.0.1:8000/api/scan_domain_pipeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain: targetDomain })
    });
    
    if (!agentResponse.ok) {
      throw new Error(`Agent backend responded with status: ${agentResponse.status}`);
    }

    const parsedData = await agentResponse.json();
    
    console.log("--- AGENT PIPELINE RESPONSE RECEIVED ---");

    // Update the backend database matching schemas...
    let insertedAssets = 0;
    let insertedPorts = 0;
    let insertedServices = 0;
    let topologyUpdated = false;

    // We can clear old data for this target or just append
    // Given the pipeline provides a fresh view, we might want to update or upsert.
    // For now, let's follow the previous pattern of inserting but with better structured data.

    if (parsedData?.assets && Array.isArray(parsedData.assets)) {
      const assetsToInsert = parsedData.assets.map((a: any) => ({ ...a, targetId, lastScanned: new Date() }));
      // Use upsert or clear-and-insert for better UX. Let's stick to insertion for now as requested.
      if (assetsToInsert.length > 0) {
        await db.collection('assets').insertMany(assetsToInsert);
        insertedAssets = assetsToInsert.length;
      }
    }
    
    if (parsedData?.ports && Array.isArray(parsedData.ports)) {
      const portsToInsert = parsedData.ports.map((p: any) => ({ ...p, targetId }));
      if (portsToInsert.length > 0) {
        await db.collection('ports').insertMany(portsToInsert);
        insertedPorts = portsToInsert.length;
      }
    }
    
    if (parsedData?.services && Array.isArray(parsedData.services)) {
      const servicesToInsert = parsedData.services.map((s: any) => ({ ...s, targetId }));
      if (servicesToInsert.length > 0) {
        await db.collection('services').insertMany(servicesToInsert);
        insertedServices = servicesToInsert.length;
      }
    }

    // Handle topology
    if (parsedData?.topology) {
      // Store topology for this target
      await db.collection('topology').updateOne(
        { targetId },
        { $set: { ...parsedData.topology, updatedAt: new Date() } },
        { upsert: true }
      );
      topologyUpdated = true;
    }

    // Update targets status if needed
    if (parsedData?.targets && Array.isArray(parsedData.targets)) {
        for (const t of parsedData.targets) {
            await db.collection('targets').updateOne(
                { name: t.name },
                { $set: { ...t, lastCompletedScan: new Date(), status: 'Idle' } },
                { upsert: true }
            );
        }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Pipeline scan complete: ${insertedAssets} assets, ${insertedPorts} ports discovered.`, 
        stats: { assets: insertedAssets, ports: insertedPorts, services: insertedServices, topologyUpdated },
        agentOutput: parsedData
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Agent pipeline execution failed:", error);
    return NextResponse.json(
      { error: 'Failed to process pipeline scan' },
      { status: 500 }
    );
  }
}
