import js from '../../../wasm/jp2/jp2';
import wasm from '../../../wasm/jp2/jp2.wasm';
import { rescaleDepth } from '../../color/depth';
import { ColorPlane } from '../../color/types';
import { loadWasmModule } from '../../util/wasm';

/* eslint-disable no-underscore-dangle */

export async function decodeJP2Image(
   file: File,
   codec: number
): Promise<{ data: Uint8Array; format: number; planes: ColorPlane[] }> {
   const module = await loadWasmModule(js, wasm, file);
   const format = module._decodeJP2Image(codec);
   const planeCount = module._getJP2Planes();
   const planes: ColorPlane[] = [];
   let dataSize = 0;
   for (let i = 0; i < planeCount; i += 1) {
      const width = module._getJP2Width(i);
      const height = module._getJP2Height(i);
      planes.push({
         offset: dataSize,
         width,
         height,
      });
      dataSize += width * height;
   }

   const data = new Uint8Array(dataSize);
   planes.forEach((plane, index) => {
      // eslint-disable-next-line no-bitwise
      const dataPtr = module._getJP2Data(index) >> 2;
      rescaleDepth(
         module._getJP2Bitdepth(index),
         module.HEAP32.subarray(dataPtr, dataPtr + plane.width * plane.height),
         data.subarray(plane.offset)
      );
   });
   return {
      data,
      format,
      planes,
   };
}