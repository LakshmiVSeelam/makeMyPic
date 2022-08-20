import { db } from "../firebase";
import { ref, onValue, get, push, set} from "firebase/database";
import { Component } from "react";


const imgRef = ref(db, "/images");

export class ImageService extends Component {
    async getImages() {
        return new Promise((resolve) => {
          onValue(imgRef, snap => {
            resolve(snap.val());
          }, {onlyOnce: true});
        });
    }
    
    async addImage(data) {
        const newImgRef = push(imgRef);
        set(newImgRef, data)
    }

}

export default ImageService;