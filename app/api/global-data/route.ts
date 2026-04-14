import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const targetId = searchParams.get('targetId');
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("cyb_dashboard");

    // If a specific type is requested with pagination
    if (type && ['assets', 'ports', 'services'].includes(type)) {
      const query = targetId && targetId !== 'all' ? { targetId } : {};
      const [items, total] = await Promise.all([
        db.collection(type).find(query).skip(skip).limit(limit).toArray(),
        db.collection(type).countDocuments(query)
      ]);

      return NextResponse.json({
        data: items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    }

    // Default: Fetch everything (summary view)
    // We limit these to 100 max to prevent mega-payloads in summary mode
    const [targets, assets, services, ports, topology] = await Promise.all([
      db.collection("targets").find({}).toArray(),
      db.collection("assets").find({}).limit(100).toArray(),
      db.collection("services").find({}).limit(100).toArray(),
      db.collection("ports").find({}).limit(100).toArray(),
      db.collection("topology").find({}).limit(10).toArray(),
    ]);

    return NextResponse.json({ targets, assets, services, ports, topology });
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch data from MongoDB" }, { status: 500 });
  }
}
