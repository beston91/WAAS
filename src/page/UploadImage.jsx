// File: src/components/Notes.js

import React, { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import { BsPlusLg } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { doc, setDoc, collection, query, where, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, auth, getSurveyResult, getUserProfile, updateUserProfile} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import moment from 'moment/moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import OpenAI from 'openai';
import ReactStars from "react-rating-stars-component";
import { v4 as uuidv4 } from 'uuid';
import '../App.css'

const UploadImage = () => {
    const [creativeMode, setCreativeMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState('');
    const [menuData, setMenuData] = useState({});
    const [comments, setComments] = useState({});
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [ratings, setRatings] = useState({});
    const [imageUID, setImageUID] = useState('')
    const [step, setStep] = useState(0); // Add this line
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    // const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const openai = new OpenAI({
        apiKey: "",
        dangerouslyAllowBrowser: true
    });

    const handleImageChange = async (event) => {
        console.log("hjere")
        const file = event.target.files[0];
        const uniqueIdentifier = uuidv4();
        setImageUID(uniqueIdentifier)

        if (file) {
            console.log("setting image")
            setImageUploadLoading(true);
            const reader = new FileReader();

            const messages = [];

            reader.onloadend = async () => {
                // The result will be a base64-encoded string
                const base64String = reader.result;
                messages.push({
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": base64String,
                                "detail": "high"
                            }
                        },
                        {
                            "type": "text",
                            "text": "Extract a list of food items and food items only in this menu in a JSON format. " +
                            "Remove all extra information like price or calories. " +
                            "You must catagorize them and and add your bestallergen information under each item " +
                            "Your output must always be in valid JSON format."
                        }
                    ]
                });
                // const response = await openai.chat.completions.create({
                //     model: "gpt-4-vision-preview",
                //     max_tokens: 1024,
                //     //seed: 665234,
                //     messages: messages,
                //     // response_format: { type: "json_object" },
                // });
                const testRes = `{
                    "Bakery": [
                      {
                        "item": "Croissant",
                        "allergens": ["gluten", "dairy"]
                      },
                      {
                        "item": "Croissant with butter & preserve",
                        "allergens": ["gluten", "dairy"]
                      },
                      {
                        "item": "Cinnamon bun",
                        "allergens": ["gluten", "dairy", "eggs"]
                      },
                      {
                        "item": "Jammy Dodger",
                        "allergens": ["gluten", "dairy"]
                      },
                      {
                        "item": "Orange polenta cake",
                        "allergens": ["gluten", "dairy", "eggs"]
                      }
                    ],
                    "Pizza": [
                      {
                        "item": "Classic Margherita",
                        "allergens": ["gluten", "dairy"]
                      },
                      {
                        "item": "Salami & mozzarella",
                        "allergens": ["gluten", "dairy", "meat"]
                      },
                      {
                        "item": "Special - please ask for toppings",
                        "allergens": ["gluten", "dairy", "varies"]
                      }
                    ],
                    "Sandwiches": [
                      {
                        "item": "Egg Florentine muffin",
                        "allergens": ["gluten", "dairy", "eggs"]
                      },
                      {
                        "item": "Egg & bacon muffin",
                        "allergens": ["gluten", "dairy", "eggs", "meat"]
                      },
                      {
                        "item": "New York deli bagel",
                        "allergens": ["gluten", "dairy", "meat", "mustard"]
                      },
                      {
                        "item": "Prawn mayonnaise, rocket challah roll",
                        "allergens": ["gluten", "shellfish", "eggs"]
                      },
                      {
                        "item": "British ham & Barber’s cheddar",
                        "allergens": ["gluten", "dairy", "meat"]
                      },
                      {
                        "item": "Scottish smoked salmon, cucumber, caper mayonnaise",
                        "allergens": ["gluten", "fish", "eggs"]
                      },
                      {
                        "item": "Chicken, smoked bacon, chilli jam",
                        "allergens": ["gluten", "meat"]
                      },
                      {
                        "item": "Hummus & falafel wrap - Vegan",
                        "allergens": ["gluten", "sesame"]
                      },
                      {
                        "item": "Gluten free egg mayonnaise sandwich",
                        "allergens": ["eggs", "dairy"]
                      }
                    ],
                    "Salads": [
                      {
                        "item": "Roast chicken, lentil and herb",
                        "allergens": ["meat"]
                      },
                      {
                        "item": "Free range egg salad",
                        "allergens": ["eggs"]
                      },
                      {
                        "item": "Vegan mezze: falafel, hummus, roasted pepper",
                        "allergens": ["sesame"]
                      }
                    ],
                    "Other": [
                      {
                        "item": "Lemon drizzle cake",
                        "allergens": ["gluten", "dairy", "eggs"]
                      },
                      {
                        "item": "Carrot cake",
                        "allergens": ["gluten", "dairy", "eggs"]
                      },
                      {
                        "item": "Breakfast muffin",
                        "allergens": ["gluten", "dairy", "eggs"]
                      },
                      {
                        "item": "Chocolate & hazelnut cookie",
                        "allergens": ["gluten", "dairy", "nuts"]
                      },
                      {
                        "item": "Pecan & oatmeal cookie",
                        "allergens": ["gluten", "nuts"]
                      },
                      {
                        "item": "Porter cake",
                        "allergens": ["gluten", "dairy", "eggs"]
                      },
                      {
                        "item": "Treacle tart",
                        "allergens": ["gluten", "dairy"]
                      },
                      {
                        "item": "Snack Pots",
                        "allergens": ["varies"]
                      },
                      {
                        "item": "Half cheddar cheese sandwich",
                        "allergens": ["gluten", "dairy"]
                      },
                      {
                        "item": "Half ham sandwich",
                        "allergens": ["gluten", "meat"]
                      },
                      {
                        "item": "Vimto jelly pot",
                        "allergens": []
                      },`
                // var extracted_food_items = response.choices[0].message.content
                var extracted_food_items = testRes;
                console.log(extracted_food_items)
                extracted_food_items = JSON.stringify(extracted_food_items, null, 1);
                
                // console.log("GPT v extracted items: " + response.choices[0].message.content);
                const userProfile = await getUserProfile(user)
                const userPreference = JSON.stringify(userProfile.surveyData, null, 1)
                const userCommentHistory = userProfile.commentHistory.reduce((acc, comment, index) => {
                    acc[`comment${index + 1}`] = comment;
                    return acc;
                  }, {});
                console.log(userCommentHistory)
                const next_messages = [
                    {
                        "role": "system",
                        "content": `You are a recommender system for food in a restaurant. You will be given a list of food options and you will give detailed personalised reccomendation according to their food preference and your understanding of the what the food item is.` +
                        `You must give your answers in JSON format`
                    },
                    {
                        "role": "user",
                        "content": `Here's the list of food options in JSON format: ${extracted_food_items}` +
                            `My food preference in JSON: "${userPreference}"` +
                            `My previous comments on food I tried: "${userProfile.commentHistory}"` +
                            (creativeMode ? `this time give me something different from my usual choices` : ``) +
                            `Give me up to 3 items if there are more than 3 items. If there is nothing satisfying the constraints like vegan options, return nothing. Format the answer as a single level JSON object with the keys as food item name and values as reccomendation reasons. Your output must always be in valid JSON format.`
                    }];

                console.log("GPT 3 prompts: " + JSON.stringify(next_messages, null, 2));
                const completion = await openai.chat.completions.create({
                    messages: next_messages,
                    model: "gpt-3.5-turbo-1106",
                    response_format: { type: "json_object" },
                });
                console.log(completion.choices[0].message.content)
                const jsonData = JSON.parse(completion.choices[0].message.content)
                console.log(jsonData)
                setMenuData(jsonData);
                setImageUploadLoading(false);
                setStep(2);
            };
            reader.readAsDataURL(file);

        }
    };

    const handleCreativeModeChange = (checked) => {
        setCreativeMode(checked);
        setStep(1); // Add this line
    };

    const handleButtonClick = (key, value) => {
        console.log(`Button clicked for ${key}: ${value}`);
        if (selectedButtons.includes(key)) {
            setSelectedButtons(selectedButtons.filter(button => button !== key));
        } else {
            setSelectedButtons([...selectedButtons, key]);
        }
        // You can add more logic or state updates here
    };

    const handleRatingClick = (key, value, rating) => {
        console.log(`Button clicked for ${key}: ${value}. Rating: ${rating}.`);
        setRatings({ ...ratings, [key]: rating });
        // You can add more logic or state updates here
    };

    const compileSelected = async () => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false)
        const userProfile = await getUserProfile(user)

        const compiled = selectedButtons.map(key => ({
            key,
            rating: ratings[key],
            comment: comments[key],
        }));
        console.log(compiled);
        if (compiled.length == 0) {
            console.log("Please enter some comments");
            setShowErrorMessage(true);
            return
        }
        setLoading(true)
        try {
            await updateUserProfile(user, userProfile.surveyData, JSON.stringify(compiled));
            setLoading(false);
        } catch (error) {
            console.error('Error adding document:', error);
            setError('Error adding the note.');
        }
        setShowSuccessMessage(true);
        // You can add more logic here, like sending the compiled data to a server
    };

    const resetStates = () => {
        setStep(0)
        setLoading(false);
        setImageUploadLoading(false);
        setError('');
        setUser('');
        setMenuData({});
        setComments({});
        setSelectedButtons([]);
        setRatings({});
        setImageUID('');
    };

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

    const renderButtons = () => {
        const keys = Object.keys(menuData);
        const values = Object.values(menuData);
        if (keys.length === 0) {
            return null; // If menuData is empty, don't render the buttons
        }

        return (
            <>
                {keys.map((key, index) => (
                    <div key={index}>
                        <button
                            className={`styled-button ${selectedButtons.includes(key) ? 'selected' : ''}`}
                            onClick={() => handleButtonClick(key, values[index])}
                        >
                            <strong>{key}</strong>: {values[index]}
                        </button>
                        <ReactStars
                            count={5}
                            onChange={(newRating) => handleRatingClick(key, values[index], newRating)}
                            size={24}
                            activeColor="#ffd700"
                        />
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={comments[key] || ''}
                            onChange={(e) => setComments({ ...comments, [key]: e.target.value })}
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    onClick={compileSelected}
                    className="styled-button px-6 py-2 text-xs text-white bg-sidebar"
                >
                    {loading ? "Adding . . ." : "Add"}
                    
                </button>
                <div>{showSuccessMessage && <p>Document added successfully!</p>}{showErrorMessage && <p>Error adding the document.</p>}</div>
                
            </>
        );
    };

    return (
        <section className='text-white mt-10 mb-20 px-3 md:px-0'>

            {step === 0 && (
                <div className='flex justify-center items-center h-full'>
                    <span>Do you want something creative?</span>
                    <div>
                        <button onClick={() => handleCreativeModeChange(true)} className={`styled-button ${creativeMode ? 'selected' : ''}`}>Yes</button>
                        <button onClick={() => handleCreativeModeChange(false)} className={`styled-button ${!creativeMode ? 'selected' : ''}`}>No</button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className='flex justify-center py-2'>
                    <label htmlFor='image-upload' className='cursor-pointer text-white styled-button'>
                        Upload Menu
                    </label>
                    <input
                        type='file'
                        id='image-upload'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {imageUploadLoading ? (
                        <div className="loading-spinner justify-center"></div>
                    ) : <div></div>}
                </div>

            )}

            {step === 2 && (
                <div className='bg-sidebar'>
                    <h2>Recommendations</h2>
                    {imageUploadLoading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <div>
                            {renderButtons()}
                        </div>
                    )}
                    <div className='flex justify-center py-2'>
                    <label htmlFor='image-upload' className='cursor-pointer text-white styled-button' onClick={resetStates}>
                        Restart
                    </label>
                </div>
                </div>
                
            )}
        </section>
    );
    return (
        <section className='text-white mt-10 mb-20 px-3 md:px-0'>
            <div className='flex justify-end py-2'>
                <label htmlFor='image-upload' className='cursor-pointer text-white styled-button' onClick={resetStates}>
                    Upload Menu
                </label>
                <input
                    type='file'
                    id='image-upload'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            </div>

            <div className='bg-sidebar'>
                <div className='flex justify-end py-2'>
                    <label>
                        <Switch
                            onChange={(checked) => setCreativeMode(checked)}
                            checked={creativeMode}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}
                        />
                        <span>{creativeMode ? 'Creative' : 'Normal'}</span>
                    </label>
                </div>

                <h2>Recommendations</h2>
                {imageUploadLoading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <div>
                        {renderButtons()}
                    </div>
                )}
            </div>

        </section>
    );
};

export default UploadImage;
