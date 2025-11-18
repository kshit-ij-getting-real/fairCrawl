import prisma from '../db';

export async function logReadEvent(params: {
  clientId: number;
  domainId: number;
  url: string;
  bytes: number;
}) {
  const pricePerKBytesMicros = 0;
  const priceMicros = Math.round((params.bytes / 1000) * pricePerKBytesMicros);

  return prisma.readEvent.create({
    data: {
      clientId: params.clientId,
      domainId: params.domainId,
      url: params.url,
      bytes: params.bytes,
      priceMicros,
    },
  });
}
