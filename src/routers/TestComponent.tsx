import { Button, Input, message, Typography } from 'antd'
import React, { useState } from 'react'
import { ModuleService } from '../hooks/Module'

const TestComponent = () => {
    const [val1, setVal1] = useState<string>('')
    const [val2, setVal2] = useState<string>('')
    const handleSubmit = () => {
        console.log("Val ", val1, val2);
        const promise = ModuleService.setUpWifi(val1, val2);
        promise.then(data => {
            message.success('ok')
            console.log("Ok when setup wifi: ", data);
        }).catch(err => {
            message.error('Connect failed, please check wifi name and password again')
        })
    }

    return (
        <div>
            <Typography.Text>SSID</Typography.Text>
            <Input
                onChange={(e) => setVal1(e.target.value)}
            />
            <br />
            <Typography.Text>Pass</Typography.Text>
            <Input
                onChange={(e) => setVal2(e.target.value)}
            />
            <br />
            <Button onClick={() => { handleSubmit() }}>Submit</Button>
        </div>
    )
}

export default TestComponent