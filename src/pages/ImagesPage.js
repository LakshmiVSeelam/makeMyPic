
import React, { useState, useEffect } from 'react';
import { ref as sRef, getDownloadURL, uploadBytes } from 'firebase/storage';


import {storage} from '../firebase';
import CreatableSelect, { useCreatable } from 'react-select/creatable';
import Select from 'react-select'
import uuid from 'react-uuid'

import CategoryService from '../services/category.service';
import ImageService from '../services/image.service';
import Loader from '../components/shared/loader';
import Table from '../components/shared/tableComponent';

const catService = new CategoryService()
const imgService = new ImageService()
const ImagesPage = () => {

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [imgs, setImg] = useState([])
    const [dbImgs, setdbImgs] = useState([])
    const [imgThumb, setImgThumb] = useState();
    const [loading, setLoading] = useState(false);
    const [catSelect, setCatSelect] = useState([]);
    const [tagsSelect, setTagsSelect] = useState([]);

    const handleClick = async(e) => {
        const id = uuid()
        setLoading(true)
        e.preventDefault();
        await Promise.all([handleUpload('thumbnail', id), handleUpload('img', id)]).then(res => {
            const imgUrl = res[1]
            const imgThumbUrl = res[0]
            imgService.addImage({
                category : catSelect,
                tags : tagsSelect,
                imgUrl : imgUrl,
                imgThumbnail : imgThumbUrl,
                id : id
            })
            setLoading(false)
        })
    }

    const loadTags = () => {
        catService.getTags().then(res => {
            const result = []
            const keys = Object.keys(res)
            for (let i = 0; i < keys.length; i++) {
                result.push({
                    value : keys[i],
                    label : res[keys[i]]['label']
                })
            }
            setTags(result)
        })
    }

    const loadCategories = () => {
        catService.getCategories().then(res => {
            const result = []
            const keys = Object.keys(res)
            for (let i = 0; i < keys.length; i++) {
                result.push({
                    value : keys[i],
                    label : res[keys[i]]['catName']
                })
            }
            setCategories(result)
        })
    }

    const getCategoryName = async(id) => {
        return new Promise(resolve => {
            catService.getCategoryById(id).then(res => {
                resolve(res)
            })
        })
    }

    const loadImages = async() => {
        imgService.getImages().then(res => {
            const promises = []
            const result = []
            const keys = Object.keys(res)

            for (let i = 0; i < keys.length; i++) {
                promises.push(
                    new Promise((resolve) => {
                        try {
                            getCategoryName(res[keys[i]]['category']).then(r => {
                                result.push({
                                    id : keys[i],
                                    category : r['catName'],
                                    tags : res[keys[i]]['tags'].map(d => d.label),
                                    imgThumbnail : res[keys[i]]['imgThumbnail'],
                                    imgUrl : res[keys[i]]['imgUrl']
                                })
                                resolve(result)
                            })
                        } catch (error) {}
                    })
                )
            }
            Promise.all(promises).then(() => {setdbImgs(result)})
            
        })
    }

    useEffect(() => {
        loadCategories()
        loadTags()
        loadImages()
    },[])

    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
      });

    const handleImageAsFile = (e) => {
        const img = e.target.files[0]
        e.target.id == 'imgThumb' ? setImgThumb(img) : setImg(img)
    }

    const handleUpload = async(type, id) => {
        try {
          event.preventDefault();
          
          let file = type == 'thumbnail' ? imgThumb : imgs;
    
          var storagePath = `images/${type}/${id}_${type}`;
    
          const storageRef = sRef(storage, storagePath);
          const uploadTask = await uploadBytes(storageRef, file).then(snap => {
            return getDownloadURL(snap.ref).then(url => {
                return url
            })
          });
          return uploadTask
        } catch (error) { throw error;}  
    }

    const handleCreate = (inputValue) => {
        setTimeout(() => {
          const newOption = createOption(inputValue);
          catService.addTag(newOption).then()
        }, 1000);
      };

      const columns = 
      [
          {
              Header: "Existing Images",
              columns: [
                  {
                      Header: "Category",
                      accessor: "category"
                  }, 
                  {
                      Header: "Tags",
                      accessor: "tags",
                      Cell: (row) => {
                            return row.value.map(d => {return <span className='me-1 bg-dark text-light rounded-pill px-2 small' key={d}>{d}</span>})
                        },
                  },
                  {
                    Header: "Thumbnail",
                    accessor: "imgThumbnail",
                    Cell: (row) => {
                        return <div><img height={34} src={row.value}/></div>
                    },
                  },
                  {
                      Header: "Image",
                      accessor: "imgUrl",
                      Cell: (row) => {
                          return <div><img height={34} src={row.value}/></div>
                      },
                  }
              ]
  
          }
      ];

    return (
        <>
        
        <div className='row d-flex h-100'>
        <div className='col-md-7 border-end'>
            {dbImgs && dbImgs.length == 0 ? (
                <p>No Images yet</p>
            ) : 
                (
                    <>
                    <Table columns={columns} data={dbImgs} page="category"/>
                    </>
                )
            }
        </div>
        <div className='col-md-5 bg-white shadow mt-4'>
        <h6 className='text-center my-2'>Upload Images</h6>
        <form className='p-5' onSubmit={handleClick}>
            <div className="mb-3">
                <label className="form-label">Select Category(s)</label>
                <Select options={categories} onChange={(e) => {setCatSelect(e.value)}}/>
            </div>
            <div className="mb-3">
                <label className="form-label">Select Tag(s)</label>
                <CreatableSelect
                    isClearable
                    isMulti
                    onChange={(e) => setTagsSelect(e)}
                    onCreateOption={handleCreate}
                    options={tags}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="imgThumb" className="form-label">Upload image thumbnail</label>
                <input required className="form-control" type="file" accept='/image/*' id="imgThumb"  onChange={handleImageAsFile}/>
            </div>
            <div className="mb-3">
                <label htmlFor="img" className="form-label">Upload Image</label>
                <input required className="form-control" type="file" accept='/image/*' id="img"  onChange={handleImageAsFile}/>
            </div>
            
            { loading ? (
                    <>
                    <Loader msg='Uploading images, please wait...'/>
                    </>
                ) : 
                    (
                        <></>
                    )
                }
            <button type="submit" className="btn btn-primary" disabled={loading ? true : false}>Submit</button>

        </form>
        </div>
        </div>
        </>
    );
 }

 export default ImagesPage;