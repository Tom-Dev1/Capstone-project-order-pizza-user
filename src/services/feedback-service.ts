import ApiResponse, { post } from '@/apis/apiUtils'

interface FeedbackRequest {
  rating: number
  comments: string
  orderId: string
}

interface FeedbackResponse {
  success: boolean
  message: string
}

class FeedbackService {
  private static instance: FeedbackService

  private constructor() {}

  public static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService()
    }
    return FeedbackService.instance
  }

  public async submitFeedback(feedback: FeedbackRequest): Promise<ApiResponse<FeedbackResponse>> {
    try {
      return await post<FeedbackResponse>('/feedbacks', feedback)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw error
    }
  }
}

export default FeedbackService
