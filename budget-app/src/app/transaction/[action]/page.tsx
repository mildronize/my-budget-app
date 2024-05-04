import * as React from "react";
import { MobileLayoutNavigation } from "@/app/tabs/components/MobileLayoutNavigation";
import { AddTransactionTab } from "@/app/tabs/AddTransactionTab";

export interface PageProps {
  params: { action: string };
}

export default function TransactionPage({ params }: PageProps) {
  console.log("params", params);
  return (
    <div>
      {/* <MobileLayoutNavigation currentRouterKey={1}> */}
        <AddTransactionTab action={params.action} />
      {/* </MobileLayoutNavigation> */}
    </div>
  );
}
