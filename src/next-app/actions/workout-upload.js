// app/actions/workout-upload.js
'use server'

import { createClient } from '../../utils/supabase/server'
import OpenAI from 'openai'
import mammoth from 'mammoth'
import pdf from 'pdf-parse/lib/pdf-parse'
import * as XLSX from 'xlsx'
import { createWorker } from 'tesseract.js'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const parseFile = async (file) => {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.type === 'application/pdf') {
    const data = await pdf(buffer)
    if (data.text.trim()) {
      return data.text
    } else {
      return 'Please upload a valid PDF file.'
    }
    // TODO: implement image parsing
    // else {
    //   const worker = await createWorker({
    //     langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
    //   });
    //   await worker.load();
    //   await worker.loadLanguage('eng');
    //   await worker.initialize('eng');
    //   const {
    //     data: { text },
    //   } = await worker.recognize(buffer);
    //   await worker.terminate();
    //   return text;
    // }
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer })
    return value
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    return csv
  }

  throw new Error('Unsupported file type')
}

async function createEmbeddings(embeddingPrompt) {
  const openaiResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: embeddingPrompt,
    encoding_format: 'float'
  })
  return openaiResponse.data[0].embedding
}

export async function handleWorkoutUpload(formData) {
  const supabase = createClient()

  try {
    const file = formData.get('file')
    const userId = formData.get('userId')
    const fileName = formData.get('fileName')

    const fileContent = await parseFile(file)
    const embedding = await createEmbeddings(fileContent)

    const { data, error } = await supabase.from('internal_workouts').insert([
      {
        user_id: userId,
        file_name: fileName,
        parsed_text: fileContent,
        embedding
      }
    ])

    if (error) {
      throw error
    }

    return {
      success: true,
      message: 'File uploaded and parsed successfully',
      data
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { success: false, message: error.message }
  }
}
