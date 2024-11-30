import React, { useContext, useEffect, useState } from 'react'
import SideNavTopSection, { TEAM } from './SideNavTopSection'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import SideNavBottomSection from './SideNavBottomSection';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { FileListContext } from '@/app/_context/FileListContext';


function SideNav() {
    const {user}:any = useKindeBrowserClient();
    const createFile = useMutation(api.files.createFile);
    const [activeTeam, setActiveTeam] = useState<TEAM>();
    const convex = useConvex();
    const [totalFiles, setTotalFiles] = useState<Number>();
    const {fileList_, setFileList_} = useContext(FileListContext);

    useEffect(() => {
      activeTeam && getFiles();
    }, [activeTeam])

    const onFileCreate = (fileName:string) => {
      console.log('File Name:', fileName)
      createFile({
        fileName: fileName,
        teamId: String(activeTeam?._id),
        createdBy: user?.email,
        archived: false,
        document: '',
        whiteboard: ''
      }).then(res => {
        if(res){
          getFiles();
          toast.success('File Created Successfully');
        }
      },(err)=>{
        toast.error('Error in creating file');
      })
    }

    const getFiles = async() => {
      const result = await convex.query(api.files.getFiles, {teamId: String(activeTeam?._id)});
      console.log('Files: ', result);
      setFileList_(result);
      setTotalFiles(result.length);
    }


  return (
    <div 
    className='h-screen 
    fixed w-72 border-[1px] p-6 flex flex-col'>

      <div className='flex-1'>
      <SideNavTopSection user={user}
      setActiveTeamInfo={(activeTeam:TEAM) => setActiveTeam(activeTeam)}/>
      </div>
       

       <div>
        <SideNavBottomSection
        totalFiles={totalFiles}
        onFileCreate={onFileCreate}
        />
       </div>
    </div>
  )
}

export default SideNav