import { useState, useEffect } from 'react';
import { db } from '@/cloud_function/index';

const useLawList = async () => {
  const [lawList, setlawList] = useState<any[]>();
  const fn = async () => {
    const dbUser = db.collection('User');
    const res = await dbUser.get();
    setlawList(res.data);
  };

  useEffect(() => {
    fn();
  }, []);

  return lawList;
};
export default useLawList;
