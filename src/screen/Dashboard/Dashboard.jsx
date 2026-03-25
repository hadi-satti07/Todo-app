import React, { useContext, useEffect, useState } from 'react'
import classes from './Dashboard.module.css'
import { ContextAPI } from '../../utils/ContextAPI'
import List from '../../components/List/List';
import Modal from '../../components/Modal/Modal';
import { db } from '../../utils/firebase';
import { doc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import { BounceLoader } from 'react-spinners'

const Dashboard = () => {

  const { theme, user, loading } = useContext(ContextAPI); // ✅ loading add
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [editData, setEditData] = useState(null);

  const closeOpenModel = () => {
    if (modal) {
      setEditData(null)
    }
    setModal(prev => !prev)
  }

  // ✅ Fetch Data
  const fetchdataFunc = async () => {

    if (!user) return;

    setLoader(true)

    try {
      const listref = collection(db, 'lists');

      const q = query(
        listref,
        where('addedBy', "==", user.uid)
      );

      const querysnapshot = await getDocs(q);

      const arr = querysnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setData(arr)

    } catch (err) {
      alert(err.message)
    } finally {
      setLoader(false)
    }
  }

  // ✅ run only when user ready
  useEffect(() => {
    if (user) {
      fetchdataFunc()
    }
  }, [user])

  // ✅ Delete
  const deleteItem = async (id) => {
    const Confirm = confirm("Are you sure you want to delete")

    if (Confirm) {
      setLoader(true)

      try {
        const deleteRef = doc(db, 'lists', id);
        await deleteDoc(deleteRef);

        const arr = data.filter((item) => item.id !== id)
        setData(arr)

      } catch (err) {
        alert(err.message)
      } finally {
        setLoader(false)
      }
    }
  }

  // ✅ 🔥 MAIN FIX (refresh error solved)
  if (loading) {
    return (
      <div className={classes.loader}>
        <BounceLoader color={theme === 'light' ? 'black' : 'white'} />
      </div>
    )
  }

  if (!user) {
    return <h1>Please login again</h1>
  }

  return (
    <div className={classes.dashboard}>

      <div className={classes.dashboardHeader}>
        <div
          onClick={closeOpenModel}
          className={[
            classes.dashboardAdd,
            theme === 'light' ? classes.dashboardLight : classes.dashboardDark
          ].join(' ')}
        >
          Add +
        </div>

        <div className={classes.dashboardBatches}>
          <div className={classes.high}>High</div>
          <div className={classes.medium}>Medium</div>
          <div className={classes.low}>Low</div>
        </div>
      </div>

      <div className={classes.cardList}>
        {
          data.map((item) => (
            <List
              key={item.id}
              data={item}
              deleteItem={deleteItem}
              closeOpenModel={closeOpenModel}
              setEditData={setEditData}
            />
          ))
        }
      </div>

      {
        modal &&
        <Modal
          theme={theme}
          closeopenmodal={closeOpenModel}
          editData={editData}
          refreshData={fetchdataFunc} // ✅ important
        />
      }

      {
        loader &&
        <div className={classes.loader}>
          <BounceLoader color={theme === 'light' ? 'black' : 'white'} />
        </div>
      }

      {
        data.length === 0 && !loader && (
          <h1 className={theme === 'light' ? classes.lighthed : classes.darkhed}>
            No any items to do
          </h1>
        )
      }

    </div>
  )
}

export default Dashboard;