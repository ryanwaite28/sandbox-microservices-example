import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Binary,
  MediaAdd,
  MediaInfo,
  MediaObject,
  StorageVersions,
  UploadStatus,
  wait
} from '@app/lib-shared';



@Component({
  selector: 'sandbox-microservices-architecture-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('testFileInput') testFileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('imageElm') imageElm?: ElementRef<HTMLImageElement>;

  loading = false;
  chunks_total: number | null = null;
  chunks_index: number | null = null;
  file: File | null = null;

  constructor() { }

  readfile() {
    this.getFileInfo()
      .then((result: any) => {
        console.log(result);
        if (result.type.includes('image')) {
          console.log(`reading image file as dataUrl.`);
          this.getFileContents(result.file)
            .then(resp => {
              // console.log(resp);
              let keys = Object.keys(result);
              let box_elem = document.getElementById('info-text');
              if (keys.length === 0) {
                box_elem!.innerHTML = '';
              }
              else {
                document.getElementById('info-text')!.innerHTML = '';
                let p = document.createElement('p');
                let text = '';
                keys.forEach(key => {
                  let value = result[key];
                  text += '<strong>' + key + '</strong>: ' + value + '<br/>';
                });
                p.innerHTML = text;
                box_elem!.appendChild(p);
              }

              if (result.type.split('/')[0] === 'image') {
                this.imageElm!.nativeElement.src = resp as any;
                this.imageElm!.nativeElement.style.display = 'block';
              }
              else {
                this.imageElm!.nativeElement.src = '';
                this.imageElm!.nativeElement.style.display = 'none';
              }
            })
        }
      })
      .catch(error => { alert('error processing...'); })
  }

  reset() {
    let input = this.testFileInput!.nativeElement;
    input.value = "";
    this.imageElm!.nativeElement.src = '';
    this.imageElm!.nativeElement.style.display = 'none';
    document.getElementById('info-text')!.innerHTML = '';
    this.loading = false;
    this.chunks_index = null;
    this.chunks_total = null;
  }

  getFileInfo() {
    return new Promise((resolve, reject) => {
      if (!this.testFileInput!.nativeElement.files || !this.testFileInput!.nativeElement.files[0]) {
        return reject({
          error: true,
          message: "input holds no file..."
        });
      }

      let file = this.testFileInput!.nativeElement.files[0];
      this.file = file;
      return resolve({
        name: file.name.split('.')[0],
        ext: file.name.split('.').slice(-1)[0],
        fullName: file.name,
        size: file.size,
        type: file.type,
        file: file,
        lastModified: file.lastModified,
        lastModifiedDate: (file as any)['lastModifiedDate']
      });
    });
  }

  async getFileContents(file: File) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject({
          error: true,
          message: "no file was provided..."
        });
      }
      if (file.constructor !== File) {
        return reject({
          error: true,
          message: "input was not of type: File..."
        });
      }

      resolve(window.URL.createObjectURL(file));

      // var reader = new FileReader();


      // reader.addEventListener("load", () => {
      //   resolve(reader.result);
      // }, false);

      // if (file) {
      //   reader.readAsDataURL(file);
      // }
    });
  }

  upload() {
    if (this.loading) {
      console.log(`Currently loading...`);
      return;
    }

    this.loading = true;

    const file = this.file!;
    var reader2 = new FileReader();

    reader2.addEventListener("load", () => {
      console.log(`file as array buffer`);
      console.log(reader2.result);
      const bufArr = new Uint8Array(reader2.result as any);
      console.log(bufArr);
      const chunk_amt = 1_000_000;
      // const chunks_list = chunk(bufArr, chunk_amt);
      // console.log(`as chunks of ${chunk_amt}`, chunks_list);
      const chunks_count = Math.ceil(bufArr.length / chunk_amt);
      console.log({ chunks_count });

      //
      let media_id: number = 0;

      // first, start upload
      fetch(`http://0.0.0.0:4000/storage/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ext: file.name.split('.').slice(-1)[0],
          type: file.type,
          size: file.size,
          chunks: chunks_count,
        } as MediaInfo)
      })
        .then((r) => r.json())
        .then(async (response) => {
          media_id = response.media_id;
          // next, add chunks
          this.chunks_total = chunks_count;
          this.chunks_index = 0;
          for (let offset = 0; offset < bufArr.length; offset += chunk_amt) {
            const data = {
              index: this.chunks_index,
              chunks: Array.from(bufArr.slice(offset, offset + chunk_amt))
            };
            const body = JSON.stringify(data);
            const promise = await fetch(`http://0.0.0.0:4000/storage/media/${response.media_id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
            })
              .then((r) => r.json())
            this.chunks_index = this.chunks_index! + 1;
            console.log({ offset, index: this.chunks_index });
          }
        })
        .then((values) => {
          console.log({ values });
          // next, finalize upload
          return fetch(`http://0.0.0.0:4000/storage/media/${media_id}`, {
            method: 'PUT',
            // headers: { 'Content-Type': 'application/json' },
          })
            .then((r) => r.json())
        })
        .then(() => {
          // get file
          setTimeout(() => {
            window.open(`http://0.0.0.0:4000/storage/media/${media_id}/serve`, '_blank');
          }, 1_000);
          this.chunks_index = null;
          this.chunks_total = null;
          this.loading = false;
        });
    }, false);

    if (file) {
      console.log(`Reading file as array buffer.`);
      reader2.readAsArrayBuffer(file);
    }
  }

  async upload2() {
    if (this.loading) {
      console.log(`Currently loading...`);
      return;
    }

    if (!this.testFileInput!.nativeElement.files || !this.testFileInput!.nativeElement.files[0]) {
      console.log(`No file found.`);
      return;
    }
    const file = this.testFileInput!.nativeElement.files[0];

    this.loading = true;

    console.log(`Getting array buffer...`);
    const bufArr = await file.arrayBuffer();

    const uintArr = new Uint8Array(bufArr);
    console.log(bufArr);
    const chunk_amt = 1_000_000;
    // const chunks_list = chunk(bufArr, chunk_amt);
    // console.log(`as chunks of ${chunk_amt}`, chunks_list);
    const chunks_count = Math.ceil(uintArr.length / chunk_amt);
    console.log({ chunks_count });



    // first, start upload
    const mediaObject: MediaObject = await fetch(`http://0.0.0.0:4000/storage/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ext: file.name.split('.').slice(-1)[0],
        type: file.type,
        size: file.size,
        chunks: chunks_count,
      } as MediaInfo)
    })
    .then((r) => r.json())
    .then(response => response.data);

    // next, add chunks
    this.chunks_total = chunks_count;
    this.chunks_index = 0;
    for (let offset = 0; offset < uintArr.length; offset += chunk_amt) {
      const data: MediaAdd = {
        index: this.chunks_index,
        chunks: Array.from(uintArr.slice(offset, offset + chunk_amt))
      };
      const body = JSON.stringify(data);
      const promise = await fetch(`http://0.0.0.0:4000/storage/media/${mediaObject.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      this.chunks_index = this.chunks_index! + 1;
      console.log({ offset, index: this.chunks_index });
    }

    // next, finalize upload
    const finalize_upload = await fetch(`http://0.0.0.0:4000/storage/media/${mediaObject.id}`, {
      method: 'PUT',
      // headers: { 'Content-Type': 'application/json' },
    })
    .then((r) => r.json());

    console.log({ finalize_upload });

    // get file
    setTimeout(() => {
      window.open(`http://0.0.0.0:4000/storage/media/${mediaObject.id}/serve`, '_blank');
    }, 1_000);

    this.chunks_index = null;
    this.chunks_total = null;
    this.loading = false;
  }

  async upload3() {
    if (this.loading) {
      console.log(`Currently loading...`);
      return;
    }

    if (!this.testFileInput!.nativeElement.files || !this.testFileInput!.nativeElement.files[0]) {
      console.log(`No file found.`);
      return;
    }
    const file = this.testFileInput!.nativeElement.files[0];
    console.log({
      name: file.name.split('.')[0],
      ext: file.name.split('.').slice(-1)[0],
      fullName: file.name,
      size: file.size,
      type: file.type,
      file: file,
      lastModified: file.lastModified,
      lastModifiedDate: (file as any)['lastModifiedDate']
    });

    this.loading = true;
    
    const fileReadStream = file.stream();



    // first, start upload
    const mediaObject: MediaObject = await fetch(`http://0.0.0.0:4000/storage/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ext: file.name.split('.').slice(-1)[0],
        type: file.type,
        size: file.size,
        chunks: null,
      } as MediaInfo)
    })
    .then((r) => r.json())
    .then(response => response.data);

    console.log({ mediaObject });

    // next, add chunks
    let chunks_portion_aggregate: Array<Uint8Array> = [];
    let chucks_aggregate_size: number = 0;
    let chucks_total_size: number = 0;
    const MAX_PORTION_SIZE: number = Binary.MEGA * 15;
    const chunk_portions_count: number = Math.ceil(file.size / MAX_PORTION_SIZE);
    console.log({ chunk_portions_count, total_size: file.size, portion_size: MAX_PORTION_SIZE });
    this.chunks_index = 0;

    const start_time = Date.now();

    const uploadBatch = () => {
      console.log(`Uploading batch:`, {
        chucks_aggregate_size,
        chucks_total_size,
        chunks_portion_aggregate,
        remaining_size: file.size - chucks_total_size,
        remain_portions: chunk_portions_count - (this.chunks_index! + 1),
        remaining_portions_str: `${this.chunks_index! + 1} / ${chunk_portions_count}`,
      });
      console.log({ index: this.chunks_index });

      return wait(100).then(() => {
        const data: MediaAdd = {
          index: this.chunks_index!,
          chunks: chunks_portion_aggregate.flatMap(c => Array.from(c)),
        };
        const body = JSON.stringify(data);
        return fetch(`http://0.0.0.0:4000/storage/media/${mediaObject.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
        .then(() => {
          this.chunks_index = this.chunks_index! + 1;
          chunks_portion_aggregate = [];
          chucks_aggregate_size = 0;
        });
      });
    };
    
    const writeStream = new WritableStream({
      write: (chunk: Uint8Array) => {
        chunks_portion_aggregate.push(chunk);
        chucks_aggregate_size += chunk.buffer.byteLength;
        chucks_total_size += chunk.buffer.byteLength;
        console.log({ chunk });
        if (chucks_aggregate_size >= MAX_PORTION_SIZE) {
          return uploadBatch();
        }
        else {
          return;
        }
      },
      close: async () => {
        console.log(`Write stream close`);
        if (chunks_portion_aggregate.length > 0) {
          await uploadBatch();
        }
        const end_time = Date.now();
        const total_time = (end_time - start_time) / 1000;
        const time_in_seconds = total_time.toFixed();
        console.log({ start_time, end_time, total_time, time_in_seconds });
        this.onClose(mediaObject);
      },
      abort(err) {
        console.log("Sink error:", err);
      }
    }, new CountQueuingStrategy({ highWaterMark: 1 }));

    fileReadStream.pipeTo(writeStream);
    
  }

  onClose(mediaObject: MediaObject) {
    // next, finalize upload
    fetch(`http://0.0.0.0:4000/storage/media/${mediaObject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chunks: this.chunks_index! + 1 })
    })
    .then((r) => r.json())
    .then((finalized) => {
      // get file
      setTimeout(() => {
        window.open(`http://0.0.0.0:4000/storage/media/${mediaObject.id}/serve`, '_blank');
      }, 1_000);
    });

    this.reset();
  }

}
