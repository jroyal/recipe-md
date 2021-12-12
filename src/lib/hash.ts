function bufToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hash(data: string) {
  const enc = new TextEncoder().encode(data)
  let hash = await crypto.subtle.digest({ name: 'SHA-256' }, enc)
  return bufToHex(hash)
}

export { hash }
