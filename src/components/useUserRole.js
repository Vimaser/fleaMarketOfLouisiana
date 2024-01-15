import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useUserRole = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "Vendors", user.uid));
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                }
            } else {
                setUserRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return userRole;
};

export default useUserRole;