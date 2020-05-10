// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export function readBlobData(blob: Blob): Promise<ArrayBuffer> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(reader.result as ArrayBuffer);
      reader.onerror = (): void => reject(reader.error);
      reader.readAsArrayBuffer(blob);
   });
}

export function checkData(data: Uint8Array, check: number[], offset = 0): boolean {
   return check.every((byte, index) => byte === data[index + offset]);
}
