import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
    Box,
    Button,
    Flex,
} from "@chakra-ui/react";
import { getDocs, collection, doc, deleteDoc } from 'firebase/firestore';


const Subjects = () => {
    // 科目のデータを格納するためのuseState
    const [ subjects, setSubjects ] = useState([]);

    // Firestoreから科目のデータを取得する処理
    const getData = async () => {
        const querySnapshot = await getDocs(collection(db, 'subjects'));
        const subjectsArray: any = [];
        querySnapshot.docs.map((doc)=>{
            subjectsArray.push({
                id: doc.id,
                name: doc.data().name,
            });
        });
        setSubjects(subjectsArray);
    }

    // 科目データを削除する処理
    const deleteData = async (id: string) => {
        await deleteDoc(doc(db, 'subjects', id));
    }

    // useEffectでgetDataを実行
    useEffect(()=>{
        getData();
    },[]);


    return (
        <Box>
            <Box>
                <Flex>
                    <Box p={3} fontWeight={'bold'}>
                        科目名
                    </Box>
                    <Box>
                    </Box>
                </Flex>
            </Box>
            {
                // map関数を使ってstaffのデータを表示
                subjects.map((item: any)=>{
                    return (
                        <Box key={item.id}>
                            <Flex>
                                <Box p={3} minWidth={'73px'}>
                                    {item.name}
                                </Box>
                                <Box>
                                    <Button onClick={()=>{
                                        deleteData(item.id);
                                        getData();
                                    }}>削除</Button>
                                </Box>
                            </Flex>
                        </Box>
                    )
                })
            }
        </Box>
    );
}

export default Subjects;
