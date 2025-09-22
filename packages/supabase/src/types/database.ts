// Generated types based on Incolab database schema
// This file contains TypeScript definitions for our database tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      service_references: {
        Row: {
          id: string
          reference_number: string
          client_name: string
          client_contact: string | null
          service_type: 'quality_analysis' | 'quantity_certification' | 'both' | 'custom'
          sample_description: string | null
          location: string | null
          priority: 'low' | 'normal' | 'high' | 'urgent'
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          estimated_completion_date: string | null
          actual_completion_date: string | null
          notes: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          reference_number: string
          client_name: string
          client_contact?: string | null
          service_type?: 'quality_analysis' | 'quantity_certification' | 'both' | 'custom'
          sample_description?: string | null
          location?: string | null
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          estimated_completion_date?: string | null
          actual_completion_date?: string | null
          notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          reference_number?: string
          client_name?: string
          client_contact?: string | null
          service_type?: 'quality_analysis' | 'quantity_certification' | 'both' | 'custom'
          sample_description?: string | null
          location?: string | null
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          estimated_completion_date?: string | null
          actual_completion_date?: string | null
          notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_references_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      operations: {
        Row: {
          id: string
          reference_id: string
          assigned_to: string | null
          assigned_at: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rescheduled'
          started_at: string | null
          completed_at: string | null
          operation_type: string | null
          equipment_used: string[] | null
          sample_quantity: number | null
          sample_units: string | null
          actual_location: string | null
          weather_conditions: string | null
          environmental_notes: string | null
          photos_urls: string[] | null
          notes: string | null
          issues_found: string | null
          quality_check_passed: boolean | null
          supervisor_approval: boolean | null
          supervisor_approved_by: string | null
          supervisor_approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_id: string
          assigned_to?: string | null
          assigned_at?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rescheduled'
          started_at?: string | null
          completed_at?: string | null
          operation_type?: string | null
          equipment_used?: string[] | null
          sample_quantity?: number | null
          sample_units?: string | null
          actual_location?: string | null
          weather_conditions?: string | null
          environmental_notes?: string | null
          photos_urls?: string[] | null
          notes?: string | null
          issues_found?: string | null
          quality_check_passed?: boolean | null
          supervisor_approval?: boolean | null
          supervisor_approved_by?: string | null
          supervisor_approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_id?: string
          assigned_to?: string | null
          assigned_at?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rescheduled'
          started_at?: string | null
          completed_at?: string | null
          operation_type?: string | null
          equipment_used?: string[] | null
          sample_quantity?: number | null
          sample_units?: string | null
          actual_location?: string | null
          weather_conditions?: string | null
          environmental_notes?: string | null
          photos_urls?: string[] | null
          notes?: string | null
          issues_found?: string | null
          quality_check_passed?: boolean | null
          supervisor_approval?: boolean | null
          supervisor_approved_by?: string | null
          supervisor_approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operations_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "service_references"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operations_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lab_analysis: {
        Row: {
          id: string
          reference_id: string
          operation_id: string | null
          analyst_id: string | null
          assigned_at: string | null
          status: 'waiting_sample' | 'in_analysis' | 'completed' | 'failed' | 'requires_retest'
          started_at: string | null
          completed_at: string | null
          sample_id: string | null
          sample_received_at: string | null
          sample_condition: string | null
          analysis_type: string[] | null
          test_methods: string[] | null
          results: Json | null
          qc_passed: boolean | null
          qc_notes: string | null
          certified_by: string | null
          certified_at: string | null
          certificate_number: string | null
          reports_urls: string[] | null
          notes: string | null
          issues_found: string | null
          requires_reanalysis: boolean | null
          reanalysis_reason: string | null
          original_analysis_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_id: string
          operation_id?: string | null
          analyst_id?: string | null
          assigned_at?: string | null
          status?: 'waiting_sample' | 'in_analysis' | 'completed' | 'failed' | 'requires_retest'
          started_at?: string | null
          completed_at?: string | null
          sample_id?: string | null
          sample_received_at?: string | null
          sample_condition?: string | null
          analysis_type?: string[] | null
          test_methods?: string[] | null
          results?: Json | null
          qc_passed?: boolean | null
          qc_notes?: string | null
          certified_by?: string | null
          certified_at?: string | null
          certificate_number?: string | null
          reports_urls?: string[] | null
          notes?: string | null
          issues_found?: string | null
          requires_reanalysis?: boolean | null
          reanalysis_reason?: string | null
          original_analysis_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_id?: string
          operation_id?: string | null
          analyst_id?: string | null
          assigned_at?: string | null
          status?: 'waiting_sample' | 'in_analysis' | 'completed' | 'failed' | 'requires_retest'
          started_at?: string | null
          completed_at?: string | null
          sample_id?: string | null
          sample_received_at?: string | null
          sample_condition?: string | null
          analysis_type?: string[] | null
          test_methods?: string[] | null
          results?: Json | null
          qc_passed?: boolean | null
          qc_notes?: string | null
          certified_by?: string | null
          certified_at?: string | null
          certificate_number?: string | null
          reports_urls?: string[] | null
          notes?: string | null
          issues_found?: string | null
          requires_reanalysis?: boolean | null
          reanalysis_reason?: string | null
          original_analysis_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_analysis_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "service_references"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_analysis_operation_id_fkey"
            columns: ["operation_id"]
            isOneToOne: false
            referencedRelation: "operations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_reference_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      reference_status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
      service_type: 'quality_analysis' | 'quantity_certification' | 'both' | 'custom'
      operation_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rescheduled'
      lab_status: 'waiting_sample' | 'in_analysis' | 'completed' | 'failed' | 'requires_retest'
      priority_level: 'low' | 'normal' | 'high' | 'urgent'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for easier usage
export type ServiceReference = Database['public']['Tables']['service_references']['Row']
export type ServiceReferenceInsert = Database['public']['Tables']['service_references']['Insert']
export type ServiceReferenceUpdate = Database['public']['Tables']['service_references']['Update']

export type Operation = Database['public']['Tables']['operations']['Row']
export type OperationInsert = Database['public']['Tables']['operations']['Insert']
export type OperationUpdate = Database['public']['Tables']['operations']['Update']

export type LabAnalysis = Database['public']['Tables']['lab_analysis']['Row']
export type LabAnalysisInsert = Database['public']['Tables']['lab_analysis']['Insert']
export type LabAnalysisUpdate = Database['public']['Tables']['lab_analysis']['Update']

// Enums for easier usage
export type ReferenceStatus = Database['public']['Enums']['reference_status']
export type ServiceType = Database['public']['Enums']['service_type']
export type OperationStatus = Database['public']['Enums']['operation_status']
export type LabStatus = Database['public']['Enums']['lab_status']
export type PriorityLevel = Database['public']['Enums']['priority_level']