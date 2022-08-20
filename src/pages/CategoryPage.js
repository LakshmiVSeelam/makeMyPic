
import React, { useState, useEffect } from 'react';

import { storage } from '../firebase';
import CategoryService from '../services/category.service'
import { ref as sRef, getDownloadURL, uploadBytes } from 'firebase/storage';

import Table from '../components/shared/tableComponent';

const catService = new CategoryService()

const CategoryPage = () => {
    const [categories, setCategories] = useState([])
    
    const [catName, setCatName] = useState('')
    const [catDesc, setCatDesc] = useState('')
    const [catIcon, setCatIcon] = useState('')

    const columns = 
    [
        {
            Header: "Existing Categories",
            columns: [
                {
                    Header: "Name",
                    accessor: "values.catName"
                }, 
                {
                    Header: "Description",
                    accessor: "values.catDesc"
                },
                {
                    Header: "Icon",
                    accessor: "values.catIcon",
                    Cell: (row) => {
                        return <div><img height={34} src={row.value}/></div>
                    },
                }
            ]

        }
    ];

    const loadCategories = () => {
        catService.getCategories().then(res => {
            const result = []
            const keys = Object.keys(res)
            for (let i = 0; i < keys.length; i++) {
                console.log(res[keys[i]])
                result.push({
                    id : keys[i],
                    values : res[keys[i]]
                })
            }
            // console.log(result)
            setCategories(result)
        })
    }

    const handleClick = async(e) => {
        e.preventDefault();
        await Promise.all([handleUpload('icon')]).then(res => {
            let catIcon = res[0]
            catService.addCategory({catName, catDesc, catIcon}).then()
        })
        
        
    }

    const handleImageAsFile = (e) => {
        const img = e.target.files[0]
        e.target.id == 'cIcon' ? setCatIcon(img) : setCatThumbnail(img)
    }

    const handleUpload = async(type) => {
        try {
          event.preventDefault();
          
          let file = type == 'icon' ? catIcon : catThumbnail;
    
        //   const storage = getStorage();
          var storagePath = `category/${type}s/${catName}_${type}`;
    
          const storageRef = sRef(storage, storagePath);
          const uploadTask = await uploadBytes(storageRef, file).then(snap => {
            return getDownloadURL(snap.ref).then(url => {
                return url
            })
          });
          return uploadTask
        } catch (error) { throw error;}  
    }
    useEffect(() => {
        loadCategories()
    },[])

    return (
        <>
        <div className='row d-flex h-100'>
            <div className='col-md-7 border-end'>
                {categories && categories.length == 0 ? (
                    <p>No categories yet</p>
                ) : 
                    (
                        <>
                        <Table columns={columns} data={categories} page="category"/>
                        </>
                    )
                }
            </div>
            <div className='col-md-5 bg-white'>
                <h6 className='text-center mt-2'>Upload Category</h6>
                <form className='p-5' onSubmit={handleClick}>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Category Name</label>
                        <input type="text" required className="form-control" name="name" onChange={e => setCatName(e.target.value)} placeholder="Enter Category Name" value={catName}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Category Description</label>
                        <input type="text" required className="form-control" name="description" onChange={e => setCatDesc(e.target.value)} placeholder="Enter Category Description" value={catDesc} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cIcon" className="form-label">Upload category icon</label>
                        <input required className="form-control" type="file" accept='/image/*' id="cIcon" onChange={handleImageAsFile}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
        </>
    );
 }

 export default CategoryPage;