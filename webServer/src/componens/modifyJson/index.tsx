// src\componens\modifyJson\index.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTranslation, updateTranslation,
     deleteTranslation, selectTranslation, selectTranslationGroupKeys,selectSelectKey, updateSelectKey, sendTranslationText, getTranslationTextsGroup } from "./index.model";
import { TranslationText } from "./index.type";
import { List, Card, Button, Input, Anchor, Popover } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { text } from "stream/consumers";



export const TranslationTextCardTem = (props: {textKey:string} ) => {
    const translation = useSelector(selectTranslation);
    const translationText = translation[props.textKey];
    const dispatch = useDispatch();
    //console.log("translationText", translationText);
    const [zhCN, setZhCN] = useState(translationText.zhCN);
    const [enUS, setEnUS] = useState(translationText.enUS);
    const [zhTW, setZhTW] = useState(translationText.zhTW);
    const [comment , setComment] = useState(translationText.comment);


    useEffect(()=>
    {
        setZhCN(translationText.zhCN);
        setEnUS(translationText.enUS);
        setZhTW(translationText.zhTW);
        setComment(translationText.comment);
    },[translation]);

    const update = (item: TranslationText) => {
        console.log("payload1 ",item ,zhCN , enUS , zhTW , comment);
        const payload: TranslationText = {
            textKey: item.textKey,
            zhCN,
            enUS,
            zhTW,
            comment
        };
        console.log("payload " , payload);
        dispatch(updateTranslation(payload));
    };
    // Add restore button
    const restore = () => {
        console.log("payload1 " ,zhCN , enUS , zhTW , comment);
        setZhCN(translationText.zhCN);
        setEnUS(translationText.enUS);
        setZhTW(translationText.zhTW);
        setComment(translationText.comment);
    };

    const del = (item: TranslationText) => {
        dispatch(deleteTranslation(item));
    };

    return (
        <Card style={{textAlign: "left"}} title={translationText.textKey}>
            <div>zhCN:{translationText.zhCN}</div>
            <Input value={zhCN} onChange={(e) => setZhCN(e.target.value)} />
            <div>enUS:{translationText.enUS}</div>
            <Input value={enUS} onChange={(e) => setEnUS(e.target.value)} />
            <div>zhTW:{translationText.zhTW}</div>
            <Input value={zhTW} onChange={(e) => setZhTW(e.target.value)} />
            <div>comment:{translationText.comment}</div>
            <Input value={comment} onChange={(e) => setComment(e.target.value)} />

            <Button type="primary" onClick={() => 
                    {
                        update(translationText);
                    }

                }>
                Update
            </Button>
            <Button type="primary" onClick={() =>{
                    restore();
            } }>
                restore
            </Button>
        </Card>
    );
};


// creat a Popover modify TranslationText
const TranslationTextPopover = (props: {textKey:string} ) =>  {
    const [open, setOpen] = useState(false);
  
    const hide = () => {
      setOpen(false);
    };
  
    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
    };

    return (
      <Popover
        content={
            <div>
                <TranslationTextCardTem textKey={props.textKey}  />
                <a onClick={hide}>close</a>
            </div>
        
        }
        title="Title"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button type="primary">Click me</Button>
      </Popover>
    );
  };



// use Card display single TranslationText 
// props type TranslationText

export const TranslationTextCard = (props: {textKey:string} ) => {
    
    const translation = useSelector(selectTranslation);
    const translationText = translation[props.textKey];
    const dispatch = useDispatch();
    //console.log("translationText", translationText);
    const [zhCN, setZhCN] = useState(translationText.zhCN);
    const [enUS, setEnUS] = useState(translationText.enUS);
    const [zhTW, setZhTW] = useState(translationText.zhTW);
    const [comment , setComment] = useState(translationText.comment);

    useEffect(()=>
    {
        setZhCN(translationText.zhCN);
        setEnUS(translationText.enUS);
        setZhTW(translationText.zhTW);
        setComment(translationText.comment);
    },[translation]);

    const update = (item: TranslationText) => {
        console.log("payload1 ",item ,zhCN , enUS , zhTW , comment);
        const payload: TranslationText = {
            textKey: item.textKey,
            zhCN,
            enUS,
            zhTW,
            comment
        };
        console.log("payload " , payload);
        dispatch(updateTranslation(payload));
    };

    const del = (item: TranslationText) => {
        dispatch(deleteTranslation(item));
    };

    return (
        <Card style={{textAlign: "left"}} title={translationText.textKey}>
            <div>
                {/* //更改字体颜色和大小 */}
                <div style={{color:"red",fontSize:"10px"}}>key:</div>
                {translationText.textKey} 
            </div>
            <div><div style={{color:"red",fontSize:"10px"}}>zhCN:</div>{translationText.zhCN}</div>
            <div><div style={{color:"red",fontSize:"10px"}}>enUS:</div>{translationText.enUS}</div>
            <div><div style={{color:"red",fontSize:"10px"}}>zhTW:</div>{translationText.zhTW}</div>
            <div><div style={{color:"red",fontSize:"10px"}}>comment:</div>{translationText.comment}</div>

            <TranslationTextPopover textKey={props.textKey}  />
        </Card>
    );
};



export const ModifyJson = () => {
    // getTranslationTextsGroup
    useEffect(() => {  
        dispatch(getTranslationTextsGroup() as any);
    }, []);


    const dispatch = useDispatch();
    const data = useSelector(selectTranslation);
    console.log("data ",data);
    //selectTranslationKeys
    const dataKeys = useSelector(selectTranslationGroupKeys);

    return (
        <div>
            {/* 使用 dataKeys 做导航菜单 , 点击按钮, 调用 updateSelectKey(key) 更新 selectKey
             */}
           

            {/* 
             // Anchor 导航菜单太长怎么换行
            <Anchor
                direction="horizontal"
                style={{width:"100%",
                overflow:"auto",
                whiteSpace:"nowrap",
                display:"flex",
                justifyContent:"flex-start",
                alignItems:"center",
                flexWrap:"wrap",

                } }
                bounds={10} 
            > */}
                {dataKeys.map((key) => {
                    return (
                        <Button
                            type="primary"
                            onClick={() =>dispatch( updateSelectKey(key)) }
                        >
                            {key}
                        </Button>
                    );
                })}
            {/* </Anchor> */}
            <br />
            <List
                grid={{ gutter: 16, column: 6 }}
                dataSource={Object.values(data)}
                renderItem={(item) => (
                    <TranslationTextCard textKey={item.textKey}  />
                )}
            />

        </div>
    );
};

// use Anchor to jump to the corresponding translation
// src\componens\modifyJson\index.tsx
