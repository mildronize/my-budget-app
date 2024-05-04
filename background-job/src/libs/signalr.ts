/**
 * Generate a realtime message to be sent to the client.
 */
export function generateRealtimeMessage(messageName: string, metadata?: Record<string, unknown>) {
  return {
    target: messageName,
    arguments: [
      JSON.stringify({
        ...(metadata ?? {}),
        emitDate: new Date().toISOString(),
      }),
    ],
  };
}
