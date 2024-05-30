import { Layout } from 'antd'
import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Headers from '../../components/header/Header'
import PageContent from '../../components/pagecontents/PageContents'

export default function Dashboard() {
    return (
        <Layout className="container">
            <Sidebar />
            <Layout>
                <Headers />
                <PageContent />
            </Layout>
        </Layout>
    )
}
