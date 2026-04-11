import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const targetId = payload.targetId || "TGT-UNKNOWN";

    const client = await clientPromise;
    const db = client.db('cyb_dashboard');

    // Fetch the target to get the domain
    const targetDoc = await db.collection('targets').findOne({
      $or: [{ id: targetId }, { _id: targetId as any }] // handles both string id and object id if casted later
    });
    const targetDomain = targetDoc?.domain || targetDoc?.primaryDomain || payload.prompt || "example.com";

    // Use the exact operational prompt requested by the user
    const strictPrompt = `Run a full reconnaissance on the specified target domain (${targetDomain}) using Subfinder, Amass, theHarvester, HTTPX, Nmap, and GAU. Once complete, return results strictly as JSON matching these schemas: For every discovered asset, use the Assets Schema (including fields like id, targetId, name, status, IPs, OS, vulnerabilities, services, and recent scans). For each open port, use the Ports Schema (including port number, protocol, severity, and related assets). For services, use the Services Schema (including service type, version, risk score, and associated assets). Ensure the JSON output matches these exact schemas so it can be directly stored in the backend.`;

    // Query the external agent backend
    const agentResponse = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: strictPrompt })
    });
    
    if (!agentResponse.ok) {
      throw new Error(`Agent backend responded with status: ${agentResponse.status}`);
    }

    const jsonRes = await agentResponse.json();
    
    // The agent might nest the response or stringify it. We attempt to extract the structured schemas.
    const parsedData = typeof jsonRes === 'string' ? JSON.parse(jsonRes) : (jsonRes.data || jsonRes);

    // Update the backend database matching schemas returned by the agent!
    // We assume the agent adhered to the schemas and returned assets, ports, and services arrays.
    if (parsedData?.assets && Array.isArray(parsedData.assets) && parsedData.assets.length > 0) {
      // Add targetId mapping dynamically if missing
      const assetsToInsert = parsedData.assets.map((a: any) => ({ ...a, targetId }));
      await db.collection('assets').insertMany(assetsToInsert);
    }
    
    if (parsedData?.ports && Array.isArray(parsedData.ports) && parsedData.ports.length > 0) {
      const portsToInsert = parsedData.ports.map((p: any) => ({ ...p, targetId }));
      await db.collection('ports').insertMany(portsToInsert);
    }
    
    if (parsedData?.services && Array.isArray(parsedData.services) && parsedData.services.length > 0) {
      const servicesToInsert = parsedData.services.map((s: any) => ({ ...s, targetId }));
      await db.collection('services').insertMany(servicesToInsert);
    }

    return NextResponse.json(
      { success: true, message: "Agent scan complete. Backend updated.", agentOutput: parsedData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Agent execution failed:", error);
    return NextResponse.json(
      { error: 'Failed to process agent scan' },
      { status: 500 }
    );
  }
}
