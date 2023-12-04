// File: src/components/Notes.js

import React, { useEffect, useRef, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { doc, setDoc, collection, query, where, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, auth, getSurveyStatus} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import moment from 'moment/moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getCurrentUser } from '../store/features/userSlice';
import OpenAI from 'openai';
import ReactStars from "react-rating-stars-component";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import '../App.css'

const Notes = () => {
    const [openSearchNotes, setOpenSearchNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState('');
    const [data, setData] = useState([]);
    const [menuData, setMenuData] = useState({});
    const [comments, setComments] = useState({});
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [ratings, setRatings] = useState({});
    const [imageUID, setImageUID] = useState('')

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const q = query(collection(db, 'users'), where('uid', '==', user));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            querySnapshot.forEach((doc) => {
                setLoading(false);
                fetchedData.push({ id: doc.id, ...doc.data() });
            });

            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    useEffect(() => {
        // Replace this with actual logic to fetch the survey status
        const fetchSurveyStatus = async () => {
            // Fetch the survey status from your backend
            const surveyStatus = await getSurveyStatus(user);
            if (!surveyStatus) {
                navigate('/survey');
            } 
        };
        fetchSurveyStatus();
    }, [user]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUser(uid);
            } else {
                console.log('Wahala de');
            }
        });
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [user, notes]);

    return (
        <section className='text-white mt-10 mb-20 px-3 md:px-0'>
            {openSearchNotes && (
                <form className='mb-6 w-full relative'>
                    <input type='search' placeholder='Search ...' className='text-secondary w-1/2 text-sm' />
                </form>
            )}

            <div className='flex justify-end py-2'>
            <label htmlFor='image-upload' className='cursor-pointer text-white styled-button' onClick={() => navigate("/newSession")}>
  New Session 
</label>
            </div>

            <div className='mt-16 grid grid-container gap-x-4 gap-y-6 '>
                {data.map((note) => (
                    <NavLink to={`/notes/${note.id}`} className='relative todo-weekly rounded-lg shadow-md' key={note.id}>
                        <p style={{ fontSize: '10px' }} className='text-right px-2'>
                            {note.dateCreated}
                        </p>
                        <div className='pt-2 border-b border-sidebar'></div>

                        {(
                            <div
                                style={{ wordWrap: 'break-word' }}
                                className='p-2 text-xs'
                                dangerouslySetInnerHTML={{ __html: note.commentHistory }}
                            />
                        )}

                        <div></div>
                    </NavLink>
                ))}
            </div>
        </section>
    );
};

export default Notes;
