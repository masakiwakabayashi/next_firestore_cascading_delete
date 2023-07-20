import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
    Box,
    Button,
    Flex,
    FormLabel,
    FormControl,
    Input,
    Select,
} from "@chakra-ui/react";
import { getDocs, collection, doc, addDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form'

// フォームで使用する変数の型を定義
type formInputs = {
    lastName: string;
    firstName: string;
    subjectInCharge: any;
}

const Teachers = () => {
    // 講師の担当科目のセレクトボックスに表示させる科目データを入れるためのuseState
    const [ subjects, setSubjects ] = useState([]);

    // React Hook Form
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<formInputs>()

    // 科目データを取得する処理
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

    // useEffectでgetDataを実行
    useEffect(()=>{
        getData();
    },[]);


    // フォームが送信されたときの処理
    const onSubmit = handleSubmit( async (data) => {
        // フォームで送信された科目のIDをリファレンスに変換する処理
        const subjectRef = doc(db, 'subjects', data.subjectInCharge);
        // Firestoreにデータを追加する処理
        await addDoc(collection(db, 'teachers'), {
            lastName: data.lastName,
            firstName: data.firstName,
            subjectInCharge: subjectRef,
        }).then(()=>{
            console.log('Document successfully written!');
        });
    });


    return (
        <Box m={4}>
            <form onSubmit={onSubmit}>
                {/* 講師の姓 */}
                <FormControl mb={5}>
                    <FormLabel htmlFor='lastName'>講師の姓</FormLabel>
                    <Input
                        id='lastName'
                        {...register('lastName')}
                    />
                </FormControl>
                {/* 講師の名 */}
                <FormControl mb={5}>
                    <FormLabel htmlFor='firstName'>講師の名</FormLabel>
                    <Input
                        id='firstName'
                        {...register('firstName')}
                    />
                </FormControl>
                {/* 担当科目 */}
                <FormControl mb={5}>
                    <FormLabel htmlFor='subjectInCharge'>担当科目</FormLabel>
                    <Select id='subjectInCharge' placeholder='担当科目' {...register('subjectInCharge')}>
                        {
                            subjects.map((item: any)=>{
                                return (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <Button mt={4} colorScheme='blue' isLoading={isSubmitting} type='submit'>
                    送信
                </Button>
            </form>
        </Box>
    );
}

export default Teachers;

