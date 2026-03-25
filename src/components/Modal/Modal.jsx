import React, { useContext, useEffect, useState } from 'react'
import classes from './Modal.module.css'
import { doc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { ContextAPI } from '../../utils/ContextAPI';

const Modal = ({ theme, closeopenmodal, editData, refreshData }) => {

    const [inputField, setInputField] = useState({
        title: '',
        date: '',
        priority: ''
    });

    const { user } = useContext(ContextAPI)

    // ✅ Add Data
    const handlecreateData = async () => {
        if (!user) {
            alert("User not loaded yet");
            return;
        }

        try {
            const listRef = collection(db, 'lists')

            await addDoc(listRef, {
                ...inputField,
                addedBy: user.uid
            });

            refreshData();      // 🔥 NEW
            closeopenmodal();   // close modal

        } catch (err) {
            alert(err.message)
        }
    }

    // ✅ Prefill for edit
    useEffect(() => {
        if (editData) {
            setInputField({
                title: editData.title,
                date: editData.date,
                priority: editData.priority
            })
        }
    }, [editData])

    // ✅ Save Button
    const handleSaveBtn = () => {

        if (
            inputField.title.length === 0 ||
            inputField.date.length === 0 ||
            inputField.priority.length === 0
        ) {
            alert('Please Fill All The Details');
            return;
        }

        if (editData) {
            updateData();
        } else {
            handlecreateData();
        }
    }

    // ✅ Update Data
    const updateData = async () => {
        try {
            const listRef = doc(db, 'lists', editData.id)

            await updateDoc(listRef, {
                title: inputField.title,
                date: inputField.date,
                priority: inputField.priority
            });

            refreshData();      // 🔥 NEW
            closeopenmodal();

        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <div className={classes.modal}>
            <div className={[
                classes.card,
                theme === 'light' ? classes.cardLight : classes.cardDark
            ].join(' ')}>

                <h1>{editData ? 'Edit' : 'Add'} Items</h1>

                <div className={classes.inputbox}>
                    <input
                        value={inputField.title}
                        onChange={(e) =>
                            setInputField({ ...inputField, title: e.target.value })
                        }
                        className={classes.inputField}
                        placeholder='Enter Items'
                    />
                </div>

                <div className={classes.secondRow}>
                    <input
                        value={inputField.date}
                        onChange={(e) =>
                            setInputField({ ...inputField, date: e.target.value })
                        }
                        className={classes.date}
                        type='date'
                    />

                    <div className={classes.badges}>
                        <div
                            onClick={() => setInputField({ ...inputField, priority: "HIGH" })}
                            className={[
                                classes.high,
                                inputField.priority === "HIGH" ? classes.selectedPriority : ''
                            ].join(' ')}
                        >
                            High
                        </div>

                        <div
                            onClick={() => setInputField({ ...inputField, priority: "MEDIUM" })}
                            className={[
                                classes.Medium,
                                inputField.priority === "MEDIUM" ? classes.selectedPriority : ''
                            ].join(' ')}
                        >
                            Medium
                        </div>

                        <div
                            onClick={() => setInputField({ ...inputField, priority: "LOW" })}
                            className={[
                                classes.Low,
                                inputField.priority === "LOW" ? classes.selectedPriority : ''
                            ].join(' ')}
                        >
                            Low
                        </div>
                    </div>
                </div>

                <div className={classes.btns}>
                    <div
                        onClick={closeopenmodal}
                        className={[classes.btn, classes.cancel].join(' ')}
                    >
                        Cancel
                    </div>

                    <div
                        className={[classes.btn, classes.add].join(' ')}
                        onClick={handleSaveBtn}
                    >
                        Save
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Modal;