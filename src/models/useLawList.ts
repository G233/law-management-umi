import { useState, useEffect } from 'react';
import { db } from '@/cloud_function/index';

const useLawList = () => {
  const [lawList, setlawList] = useState<any[]>();
  
  useEffect(() => {
    const fn = async () => {
      const dbUser = db.collection('User');
      const res = await dbUser.get();
      setlawList(res.data);
    };
    fn();
  }, []);

  return lawList;
};
export default useLawList;
