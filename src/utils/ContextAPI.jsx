import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "./firebase";


export const ContextAPI = createContext();

const ContextTheme = ({children})=>{

    const [theme, setTheme] = useState('light')
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')):null);
    const [loading,setLoading] = useState(true)
    const toogleTheme = (value)=>{
       setTheme(value)
    }

    useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (userData) => {
    setUser(userData);
    setLoading(false); // 🔥 yahan hona chahiye
  });

  return () => unsubscribe(); // cleanup
}, []);
    return(
        <ContextAPI.Provider value={{theme,toogleTheme, user, loading}}>
            {children}
        </ContextAPI.Provider>
    )
}

export default ContextTheme;