import { db } from "../firebase";
import { ref, onValue, get, push, set} from "firebase/database";
import { Component } from "react";


const catRef = ref(db, "/categories");
const tagRef = ref(db, "/tags")

export class CategoryService extends Component {
    async getCategories() {
        return new Promise((resolve) => {
          onValue(catRef, snap => {
            resolve(snap.val());
          }, {onlyOnce: true});
        });
    }

    async getCategoryById(id) {
      const cref = ref(db, `/categories/${id}`) 
      return new Promise((resolve) => {
        onValue(cref, snap => {
          resolve(snap.val());
        }, {onlyOnce: true});
      });
    }
    
    async addCategory(data) {
        const newPostRef = push(catRef);
        set(newPostRef, data)
    }

    async getTags() {
      return new Promise((resolve) => {
        onValue(tagRef, snap => {
          resolve(snap.val());
        }, {onlyOnce: true});
      });
    }

    async addTag(data) {
      const newTagRef = push(tagRef);
      set(newTagRef, data)
    }
}

export default CategoryService;