import { createSlice } from '@reduxjs/toolkit'

export const tasksStateSlice = createSlice({
  name: 'tasks',
  initialState: [
    // {
    //   "uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //   "success": 0,
    //   "fail": 1,
    //   "total": 1,
    //   "items": [
    //     {
    //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //       "result": null,
    //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
    //       "created_at": "2023-07-18T13:13:10.248578Z"
    //     },
    //     {
    //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //       "success": true,
    //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
    //       "created_at": "2023-07-18T13:13:10.248578Z"
    //     }, {
    //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //       "error": true,
    //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
    //       "created_at": "2023-07-18T13:13:10.248578Z"
    //     }
    //   ]
    // },
    // {
    //   "uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //   "success": 0,
    //   "fail": 1,
    //   "total": 1,
    //   "items": [
    //     {
    //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //       "result": null,
    //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
    //       "created_at": "2023-07-18T13:13:10.248578Z"
    //     },
    //     {
    //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //       "success": true,
    //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
    //       "created_at": "2023-07-18T13:13:10.248578Z"
    //     }, {
    //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
    //       "error": true,
    //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
    //       "created_at": "2023-07-18T13:13:10.248578Z"
    //     }
    //   ]
    // },
  ],
  reducers: {
    tasksAdded: (state, action) => {
        return action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { tasksAdded } = tasksStateSlice.actions

export default tasksStateSlice.reducer