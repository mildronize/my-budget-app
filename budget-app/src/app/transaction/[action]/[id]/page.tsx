import * as React from "react";
import { MobileLayoutNavigation } from "@/app/tabs/components/MobileLayoutNavigation";
import { TransactionDataContainer } from "@/app/tabs/TransactionDataContainer";

export interface PageProps {
  params: { action: string; id: string };
}

export default function TransactionSinglePage({ params }: PageProps) {
  console.log('params',params);
  return (
    <div>
      {/* <MobileLayoutNavigation currentRouterKey={1} title="Edit Transaction"> */}
        <TransactionDataContainer action={params.action} id={params.id} />
      {/* </MobileLayoutNavigation> */}
    </div>
  );
}
