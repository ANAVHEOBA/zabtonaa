import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Box, Center, Icon, Button } from '@chakra-ui/react'
import { AiOutlineLeft } from 'react-icons/ai'
import axios from 'axios'
import { uploadStorage } from '../../supabase/storage'

interface Props {
  setStep: Function
  selectedType: number
  image?: string
  contents?: string
}

const Preview: React.FC<Props> = ({ setStep, selectedType, image, contents }) => {
  const [preview, setPreview] = useState<string>('')

  const handleUploadStorage = async (image: string | null) => {
    if (!image) return
    const { pathname } = await uploadStorage({
      image,
      bucketName: "themeimage",
    })
    if (pathname) console.debug({ pathname })
    return pathname
  }

  const handleSubmit = async () => {
    if(image) {
      const pathname = await handleUploadStorage(image)
      const data = {
        'ownerAddress': '',
        'contents': contents ? contents : '',
        'imagePath': pathname,
        'type': selectedType,
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      }
      console.log(data)
      return new Promise((resolve, reject) => {
        axios.post('/api/postTheme', data, config)
        .then(response => {
          if(response.status !== 200) {
            throw Error("Server error")
          }
          resolve(response)
        })
        .catch(e => {
          reject(e);
          throw Error("Server error:" + e)
        })
      })
    } else {
      const data = {
        'ownerAddress': '',
        'contents': contents,
        'type': selectedType,
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      }
      console.log(data);
      return new Promise((resolve, reject) => {
        axios.post('/api/postTheme', data, config)
        .then(response => {
          if(response.status !== 200) {
            throw Error("Server error")
          }
          resolve(response)
        })
        .catch(e => {
          reject(e)
          throw Error("Server error:" + e)
        })
      })
    }
  }

  useEffect(() => {
    if(!image) return
    setPreview(window.URL.createObjectURL(image))
  }, [image])

  return (
    <>
      <Box pt='60px'>
        <Center color='black' mt='20px' fontWeight='bold' fontSize='2xl'>
        <Icon position='absolute' left='20px' float='left' as={AiOutlineLeft} onClick={() => {setStep(1)}} />
          お題のプレビュー
        </Center>
      </Box>
      <Box mt='20px'>
        {selectedType === 1 ? (
          <>
            <Image
              src={preview}
              alt="preview"
              width={window.innerWidth}
              height={window.innerHeight}
            />
            <Center>
              <Button
                colorScheme='pink'
                w='40%'
                mt='30px'
                onClick={handleSubmit}
              >
                これでOK！
              </Button>
            </Center>
          </>
        ) : selectedType === 2 ? (
          <>
            <Box w={window.innerWidth} h={window.innerWidth} bg='white' border='2px solid black' >
              <Center w='100%' h='100%' fontWeight='bold' fontSize='30px' textAlign='center'>
                {contents}
              </Center>
            </Box>
            <Center>
              <Button
                colorScheme='pink'
                w='40%'
                mt='30px'
                onClick={handleSubmit}
              >
                これでOK！
              </Button>
            </Center>
          </>
        ) : (
          <>
            <Box position='relative'>
              <Image
                src={preview}
                alt="preview"
                width={window.innerWidth}
                height={window.innerHeight}
              />
              <Box
                w='100%'
                h='100%'
                p='5%'
                fontWeight='bold'
                fontSize='30px'
                textAlign='center'
                position='absolute'
                top={window.innerWidth - 160}
              >
                {contents}
              </Box>
            </Box>
            <Center>
              <Button
                colorScheme='pink'
                w='40%'
                mt='30px'
                onClick={handleSubmit}
              >
                これでOK！
              </Button>
            </Center>
          </>
        )}
      </Box>
    </>
  )
}

export default Preview