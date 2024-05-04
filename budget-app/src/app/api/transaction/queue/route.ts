import { customError } from "@/global/errorHandler";
import { globalHandler } from "@/global/globalHandler";
import { poisonQueue, queue, longQueue, longPoisonQueue } from "@/bootstrap";
import { NextResponse } from "next/server";

export const GET = globalHandler(async () => {
  const queueCountResult = await Promise.all([
    queue.length(),
    poisonQueue.length(),
    longQueue.length(),
    longPoisonQueue.length(),
  ]);
  const queueCount = {
    transactionMain: queueCountResult[0],
    transactionPoison: queueCountResult[1],
    longMain: queueCountResult[2],
    longPoison: queueCountResult[3],
  };
  try {
    return NextResponse.json({
      success: true,
      data: {
        ...queueCount,

        /**
         * @deprecated Use queueCount.transactionMain instead
         */
        numberOfMessages: queueCount.transactionMain,
        /**
         * @deprecated Use queueCount.transactionPoison instead
         */
        poisonQueue: {
          numberOfMessages: queueCount.transactionPoison,
        },
      },
    });
  } catch (error) {
    throw customError(
      error,
      "Failed to get the number of messages in the queue"
    );
  }
});
