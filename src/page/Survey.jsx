import React from 'react';
import './survey.css';
import { useForm, Controller} from 'react-hook-form';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../firebase'; // You need to implement this
import { useDispatch, useSelector } from 'react-redux';

const Survey = () => {
    const { register, handleSubmit, control } = useForm();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value);

    const questions = [
        {
          id: 1,
          question: "What is your favorite cuisine?",
          options: [
            { value: 'italian', label: 'Italian' },
            { value: 'mexican', label: 'Mexican' },
            { value: 'chinese', label: 'Chinese' },
            { value: 'indian', label: 'Indian' },
          ]
        },
        {
          id: 2,
          question: "What resitriction of food do you have",
          options: [
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'meat', label: 'Meat' },
            { value: 'seafood', label: 'Seafood' },
          ]
        },
        {
          id: 3,
          question: "What is your favorite meal of the day?",
          options: [
            { value: 'breakfast', label: 'Breakfast' },
            { value: 'lunch', label: 'Lunch' },
            { value: 'dinner', label: 'Dinner' },
          ]
        },
        {
          id: 4,
          question: "Do you have any food allergies?",
          options: [
            { value: 'nuts', label: 'nuts' },
            { value: 'fruits', label: 'fruits' },
          ]
        },
        {
            id: 5,
            question: "Do you prefer spicy food?",
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]
          },
          {
            id: 6,
            question: "Do you enjoy trying new foods and cuisines?",
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]
          }
        // Add more questions as needed
    ];

    const onSubmit = async (data) => {
        // Include the question text in the data object
        console.log(data)
        const dataWithQuestions = questions.map((q) => 
        ({
            question: q.question,
            answer: data[`question${q.id}`]
        }));
        // Save the survey data to Firebase
        await updateUserProfile(user.uid, dataWithQuestions, "");

        // Redirect the user to the home page after they complete the survey
        navigate('/notes');
    };

    return (
        <form className="survey-form" onSubmit={handleSubmit(onSubmit)}>
          {questions.map((q) => (
           <div key={q.id}>
           <label className="survey-question">{q.question}</label>
           {q.type === 'input' ? (
             <input
               {...register(`question${q.id}`)}
               className="survey-input"
             />
           ) : (
             <Controller
               name={`question${q.id}`}
               control={control}
               render={({ field }) => (
                 <Select
                   {...field}
                   options={q.options}
                   isSearchable
                   isClearable
                   className="survey-select"
                 />
               )}
             />
           )}
         </div>
          ))}
          <button type="submit" className="survey-submit">Submit</button>
        </form>
      );
};

export default Survey;