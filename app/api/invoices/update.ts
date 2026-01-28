import {createClient} from "@/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const body = await request.json();
    const {id, customer_name, total_amount, status} = body;

    if (!id || !customer_name || !total_amount) {
      return NextResponse.json(
        {error: "Missing required fields"},
        {status: 400},
      );
    }

    const {error, data} = await supabase
      .from("invoices")
      .update({
        customer_name: customer_name.trim(),
        total_amount: Number(total_amount),
        status: status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({error: error.message}, {status: 400});
    }

    return NextResponse.json({success: true, data}, {status: 200});
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({error: message}, {status: 500});
  }
}
