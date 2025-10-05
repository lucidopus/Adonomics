import { ObjectId } from 'mongodb'

export type AdvertisementStatus = 'upload' | 'analyzing' | 'analyzed' | 'approved' | 'suspended' | 'rejected'

export type DecisionType = 'approve' | 'suspend' | 'reject'

export interface AnalysisResults {
  // Step 1: Deep Video Understanding (Twelve Labs)
  video_analysis?: {
    task_id: string
    video_id: string
    analysis_data: any // Twelve Labs response
    extracted_at: Date
  }

  // Step 2: User Personalization
  user_profile?: {
    summary: string
    generated_at: Date
  }

  // Step 3: Competitive Intelligence
  competitive_search?: {
    similar_ads: any[] // Array of similar ad data
    searched_at: Date
  }

  // Final synthesis
  synthesis?: {
    report: any // The structured function call output
    generated_at: Date
  }
}

export interface Decision {
  type: DecisionType
  comments?: string
  reasoning?: string
  decided_at: Date
  decided_by: ObjectId // user_id
}

export interface PerformanceMetrics {
  // Initially empty, populated later for approved ads
  views?: number
  engagement?: number
  conversions?: number
  ctr?: number
  // Add more metrics as needed
  last_updated?: Date
}

export interface Advertisement {
  _id?: ObjectId
  user_id: ObjectId

  // Video source
  video_url?: string // For URL uploads
  video_filename?: string // For file uploads
  video_file_size?: number // For file uploads

  // Twelve Labs integration
  twelve_labs_index_id?: string
  twelve_labs_task_id?: string
  twelve_labs_video_id?: string

  // Status and workflow
  status: AdvertisementStatus
  status_history: Array<{
    status: AdvertisementStatus
    changed_at: Date
    changed_by?: ObjectId
    notes?: string
  }>

  // Analysis results
  analysis_results?: AnalysisResults

  // User decision
  decision?: Decision

  // Performance metrics (for approved ads)
  metrics?: PerformanceMetrics

  // Metadata
  title?: string // User-provided or auto-generated
  description?: string
  tags?: string[]

  // Timestamps
  created_at: Date
  updated_at: Date
  uploaded_at: Date
  analyzed_at?: Date
  decided_at?: Date
}

export class AdvertisementModel {
  static collectionName = 'advertisements'

  static createAdvertisement(
    userId: ObjectId,
    videoData: {
      video_url?: string
      video_filename?: string
      video_file_size?: number
    }
  ): Omit<Advertisement, '_id'> {
    const now = new Date()

    return {
      user_id: userId,
      ...videoData,
      status: 'upload',
      status_history: [{
        status: 'upload',
        changed_at: now,
        changed_by: userId
      }],
      created_at: now,
      updated_at: now,
      uploaded_at: now
    }
  }

  static updateStatus(
    existing: Advertisement,
    newStatus: AdvertisementStatus,
    changedBy?: ObjectId,
    notes?: string
  ): Advertisement {
    const now = new Date()

    return {
      ...existing,
      status: newStatus,
      status_history: [
        ...existing.status_history,
        {
          status: newStatus,
          changed_at: now,
          changed_by: changedBy,
          notes
        }
      ],
      updated_at: now,
      ...(newStatus === 'analyzed' && { analyzed_at: now }),
      ...(newStatus === 'approved' || newStatus === 'suspended' || newStatus === 'rejected' ? { decided_at: now } : {})
    }
  }

  static addAnalysisResults(
    existing: Advertisement,
    step: keyof AnalysisResults,
    data: any
  ): Advertisement {
    const now = new Date()

    return {
      ...existing,
      analysis_results: {
        ...existing.analysis_results,
        [step]: {
          ...data,
          [`${step === 'video_analysis' ? 'extracted' : step === 'user_profile' ? 'generated' : step === 'competitive_search' ? 'searched' : 'generated'}_at`]: now
        }
      },
      updated_at: now
    }
  }

  static setDecision(
    existing: Advertisement,
    decision: Omit<Decision, 'decided_at' | 'decided_by'>,
    decidedBy: ObjectId
  ): Advertisement {
    const now = new Date()

    return {
      ...existing,
      decision: {
        ...decision,
        decided_at: now,
        decided_by: decidedBy
      },
      updated_at: now,
      decided_at: now
    }
  }

  static updateMetrics(
    existing: Advertisement,
    metrics: Partial<PerformanceMetrics>
  ): Advertisement {
    const now = new Date()

    return {
      ...existing,
      metrics: {
        ...existing.metrics,
        ...metrics,
        last_updated: now
      },
      updated_at: now
    }
  }

  static toAdvertisementDocument(ad: Partial<Advertisement>): Advertisement {
    const now = new Date()

    return {
      _id: ad._id || new ObjectId(),
      user_id: ad.user_id || new ObjectId(),
      video_url: ad.video_url,
      video_filename: ad.video_filename,
      video_file_size: ad.video_file_size,
      twelve_labs_index_id: ad.twelve_labs_index_id,
      twelve_labs_task_id: ad.twelve_labs_task_id,
      twelve_labs_video_id: ad.twelve_labs_video_id,
      status: ad.status || 'upload',
      status_history: ad.status_history || [{
        status: 'upload',
        changed_at: now
      }],
      analysis_results: ad.analysis_results,
      decision: ad.decision,
      metrics: ad.metrics,
      title: ad.title,
      description: ad.description,
      tags: ad.tags || [],
      created_at: ad.created_at || now,
      updated_at: ad.updated_at || now,
      uploaded_at: ad.uploaded_at || now,
      analyzed_at: ad.analyzed_at,
      decided_at: ad.decided_at
    }
  }
}