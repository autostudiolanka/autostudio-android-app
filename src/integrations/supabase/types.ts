export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      backdrops: {
        Row: {
          aspect_ratio: string
          category: string | null
          created_at: string
          id: string
          is_platform_default: boolean
          name: string
          public_url: string | null
          storage_path: string
        }
        Insert: {
          aspect_ratio: string
          category?: string | null
          created_at?: string
          id?: string
          is_platform_default?: boolean
          name: string
          public_url?: string | null
          storage_path: string
        }
        Update: {
          aspect_ratio?: string
          category?: string | null
          created_at?: string
          id?: string
          is_platform_default?: boolean
          name?: string
          public_url?: string | null
          storage_path?: string
        }
        Relationships: []
      }
      car_jobs: {
        Row: {
          created_at: string
          dealership_id: string
          deleted_at: string | null
          id: string
          registration: string | null
          slots: Json | null
          sold_at: string | null
          status: string
          updated_at: string
          user_id: string | null
          vehicle_details: Json | null
        }
        Insert: {
          created_at?: string
          dealership_id: string
          deleted_at?: string | null
          id?: string
          registration?: string | null
          slots?: Json | null
          sold_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vehicle_details?: Json | null
        }
        Update: {
          created_at?: string
          dealership_id?: string
          deleted_at?: string | null
          id?: string
          registration?: string | null
          slots?: Json | null
          sold_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vehicle_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "car_jobs_dealership_id_fkey"
            columns: ["dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
        ]
      }
      cookie_consents: {
        Row: {
          consented_at: string
          id: string
          ip_hash: string | null
          preferences: Json
          subscription_id: string
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          consented_at?: string
          id?: string
          ip_hash?: string | null
          preferences: Json
          subscription_id: string
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          consented_at?: string
          id?: string
          ip_hash?: string | null
          preferences?: Json
          subscription_id?: string
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cookie_consents_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_company_info: {
        Row: {
          brn: string | null
          created_at: string
          data_protection_email: string | null
          finance_partners: Json
          id: string
          legal_name: string
          payment_methods: string[]
          registered_address_city: string | null
          registered_address_line1: string | null
          registered_address_line2: string | null
          registered_address_postal: string | null
          social_links: Json
          subscription_id: string
          tin_number: string | null
          trade_memberships: Json
          trading_name: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          brn?: string | null
          created_at?: string
          data_protection_email?: string | null
          finance_partners?: Json
          id?: string
          legal_name: string
          payment_methods?: string[]
          registered_address_city?: string | null
          registered_address_line1?: string | null
          registered_address_line2?: string | null
          registered_address_postal?: string | null
          social_links?: Json
          subscription_id: string
          tin_number?: string | null
          trade_memberships?: Json
          trading_name?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          brn?: string | null
          created_at?: string
          data_protection_email?: string | null
          finance_partners?: Json
          id?: string
          legal_name?: string
          payment_methods?: string[]
          registered_address_city?: string | null
          registered_address_line1?: string | null
          registered_address_line2?: string | null
          registered_address_postal?: string | null
          social_links?: Json
          subscription_id?: string
          tin_number?: string | null
          trade_memberships?: Json
          trading_name?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_company_info_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_legal_overrides: {
        Row: {
          content: Json
          id: string
          is_active: boolean
          subscription_id: string
          template_type: string
          title: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          id?: string
          is_active?: boolean
          subscription_id: string
          template_type: string
          title?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          id?: string
          is_active?: boolean
          subscription_id?: string
          template_type?: string
          title?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_legal_overrides_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_page_blocks: {
        Row: {
          block_type: string
          content: Json
          created_at: string
          display_order: number
          enabled: boolean
          id: string
          page_slug: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          block_type: string
          content?: Json
          created_at?: string
          display_order?: number
          enabled?: boolean
          id?: string
          page_slug: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          block_type?: string
          content?: Json
          created_at?: string
          display_order?: number
          enabled?: boolean
          id?: string
          page_slug?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      dealer_page_settings: {
        Row: {
          created_at: string
          id: string
          page_slug: string
          settings: Json
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_slug: string
          settings?: Json
          subscription_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          page_slug?: string
          settings?: Json
          subscription_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      dealer_showrooms: {
        Row: {
          address_line1: string
          address_line2: string | null
          branch_name: string | null
          city: string
          created_at: string
          email: string | null
          google_maps_url: string | null
          id: string
          is_primary: boolean
          latitude: number | null
          longitude: number | null
          opening_hours: Json
          phone: string | null
          postal_code: string | null
          sort_order: number
          subscription_id: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          branch_name?: string | null
          city: string
          created_at?: string
          email?: string | null
          google_maps_url?: string | null
          id?: string
          is_primary?: boolean
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json
          phone?: string | null
          postal_code?: string | null
          sort_order?: number
          subscription_id: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          branch_name?: string | null
          city?: string
          created_at?: string
          email?: string | null
          google_maps_url?: string | null
          id?: string
          is_primary?: boolean
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json
          phone?: string | null
          postal_code?: string | null
          sort_order?: number
          subscription_id?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_showrooms_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      dealership_users: {
        Row: {
          created_at: string
          dealership_id: string
          id: string
          permission_overrides: Json
          permissions: Json
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dealership_id: string
          id?: string
          permission_overrides?: Json
          permissions?: Json
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dealership_id?: string
          id?: string
          permission_overrides?: Json
          permissions?: Json
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealership_users_dealership_id_fkey"
            columns: ["dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
        ]
      }
      dealerships: {
        Row: {
          address: string | null
          business_hours: string | null
          city: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          dealership_id: string
          follow_up_sent_at: string | null
          id: string
          message: string | null
          responded_at: string | null
          source: string
          status: string
          subscription_id: string
          vehicle_id: string | null
          whatsapp_sent: boolean
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          dealership_id: string
          follow_up_sent_at?: string | null
          id?: string
          message?: string | null
          responded_at?: string | null
          source?: string
          status?: string
          subscription_id: string
          vehicle_id?: string | null
          whatsapp_sent?: boolean
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          dealership_id?: string
          follow_up_sent_at?: string | null
          id?: string
          message?: string | null
          responded_at?: string | null
          source?: string
          status?: string
          subscription_id?: string
          vehicle_id?: string | null
          whatsapp_sent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_logos: {
        Row: {
          created_at: string
          id: string
          logo_url: string
          name: string
          sort_order: number
          subscription_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url: string
          name: string
          sort_order?: number
          subscription_id: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string
          name?: string
          sort_order?: number
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_logos_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      image_batch_jobs: {
        Row: {
          attempt: number
          car_job_id: string
          completed_at: string | null
          created_at: string
          dealership_id: string
          error: string | null
          gemini_batch_name: string | null
          id: string
          items: Json
          status: string
          submitted_at: string | null
          subscription_id: string
          updated_at: string
        }
        Insert: {
          attempt?: number
          car_job_id: string
          completed_at?: string | null
          created_at?: string
          dealership_id: string
          error?: string | null
          gemini_batch_name?: string | null
          id?: string
          items?: Json
          status?: string
          submitted_at?: string | null
          subscription_id: string
          updated_at?: string
        }
        Update: {
          attempt?: number
          car_job_id?: string
          completed_at?: string | null
          created_at?: string
          dealership_id?: string
          error?: string | null
          gemini_batch_name?: string | null
          id?: string
          items?: Json
          status?: string
          submitted_at?: string | null
          subscription_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      imaging_request_counters: {
        Row: {
          kind: string
          request_count: number
          subscription_id: string
          updated_at: string
          year_month: string
        }
        Insert: {
          kind: string
          request_count?: number
          subscription_id: string
          updated_at?: string
          year_month: string
        }
        Update: {
          kind?: string
          request_count?: number
          subscription_id?: string
          updated_at?: string
          year_month?: string
        }
        Relationships: [
          {
            foreignKeyName: "imaging_request_counters_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      imaging_vehicle_months: {
        Row: {
          car_job_id: string
          dealership_id: string
          first_claimed_at: string
          subscription_id: string
          year_month: string
        }
        Insert: {
          car_job_id: string
          dealership_id: string
          first_claimed_at?: string
          subscription_id: string
          year_month: string
        }
        Update: {
          car_job_id?: string
          dealership_id?: string
          first_claimed_at?: string
          subscription_id?: string
          year_month?: string
        }
        Relationships: [
          {
            foreignKeyName: "imaging_vehicle_months_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          dealership_id: string | null
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          dealership_id?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          dealership_id?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      part_exchange_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          part_exchange_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          part_exchange_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          part_exchange_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "part_exchange_activities_part_exchange_id_fkey"
            columns: ["part_exchange_id"]
            isOneToOne: false
            referencedRelation: "part_exchanges"
            referencedColumns: ["id"]
          },
        ]
      }
      part_exchange_photos: {
        Row: {
          angle: string | null
          created_at: string
          display_order: number | null
          id: string
          part_exchange_id: string
          storage_path: string
          url: string
        }
        Insert: {
          angle?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          part_exchange_id: string
          storage_path: string
          url: string
        }
        Update: {
          angle?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          part_exchange_id?: string
          storage_path?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "part_exchange_photos_part_exchange_id_fkey"
            columns: ["part_exchange_id"]
            isOneToOne: false
            referencedRelation: "part_exchanges"
            referencedColumns: ["id"]
          },
        ]
      }
      part_exchanges: {
        Row: {
          accident_history_notes: string | null
          body_type: string | null
          color: string | null
          completion_stage: string
          condition_rating: string | null
          created_at: string
          customer_email: string | null
          customer_expected_value_lkr: number | null
          customer_name: string
          customer_phone: string
          dealer_offer_lkr: number | null
          dealership_id: string
          engine_capacity: string | null
          enquiry_type: string
          fuel_type: string | null
          has_accident_history: boolean | null
          has_modifications: boolean | null
          has_outstanding_finance: boolean | null
          hub_car_job_id: string | null
          id: string
          internal_notes: string | null
          lost_reason: string | null
          make: string | null
          mileage: number | null
          model: string | null
          modifications_notes: string | null
          outstanding_finance_notes: string | null
          photos_completed_at: string | null
          previous_owners: number | null
          pushed_to_hub_at: string | null
          qa_completed_at: string | null
          reg_lookup_data: Json | null
          registration: string
          service_history: string | null
          service_history_notes: string | null
          source: string | null
          status: string
          status_changed_at: string | null
          target_vehicle_id: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          accident_history_notes?: string | null
          body_type?: string | null
          color?: string | null
          completion_stage?: string
          condition_rating?: string | null
          created_at?: string
          customer_email?: string | null
          customer_expected_value_lkr?: number | null
          customer_name: string
          customer_phone: string
          dealer_offer_lkr?: number | null
          dealership_id: string
          engine_capacity?: string | null
          enquiry_type?: string
          fuel_type?: string | null
          has_accident_history?: boolean | null
          has_modifications?: boolean | null
          has_outstanding_finance?: boolean | null
          hub_car_job_id?: string | null
          id?: string
          internal_notes?: string | null
          lost_reason?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          modifications_notes?: string | null
          outstanding_finance_notes?: string | null
          photos_completed_at?: string | null
          previous_owners?: number | null
          pushed_to_hub_at?: string | null
          qa_completed_at?: string | null
          reg_lookup_data?: Json | null
          registration: string
          service_history?: string | null
          service_history_notes?: string | null
          source?: string | null
          status?: string
          status_changed_at?: string | null
          target_vehicle_id?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          accident_history_notes?: string | null
          body_type?: string | null
          color?: string | null
          completion_stage?: string
          condition_rating?: string | null
          created_at?: string
          customer_email?: string | null
          customer_expected_value_lkr?: number | null
          customer_name?: string
          customer_phone?: string
          dealer_offer_lkr?: number | null
          dealership_id?: string
          engine_capacity?: string | null
          enquiry_type?: string
          fuel_type?: string | null
          has_accident_history?: boolean | null
          has_modifications?: boolean | null
          has_outstanding_finance?: boolean | null
          hub_car_job_id?: string | null
          id?: string
          internal_notes?: string | null
          lost_reason?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          modifications_notes?: string | null
          outstanding_finance_notes?: string | null
          photos_completed_at?: string | null
          previous_owners?: number | null
          pushed_to_hub_at?: string | null
          qa_completed_at?: string | null
          reg_lookup_data?: Json | null
          registration?: string
          service_history?: string | null
          service_history_notes?: string | null
          source?: string | null
          status?: string
          status_changed_at?: string | null
          target_vehicle_id?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      photo_processing_log: {
        Row: {
          created_at: string
          credits_used: number
          dealership_id: string
          engine: string
          error_message: string | null
          id: string
          original_url: string
          processed_url: string | null
          status: string
          subscription_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          dealership_id: string
          engine: string
          error_message?: string | null
          id?: string
          original_url: string
          processed_url?: string | null
          status?: string
          subscription_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          dealership_id?: string
          engine?: string
          error_message?: string | null
          id?: string
          original_url?: string
          processed_url?: string | null
          status?: string
          subscription_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_processing_log_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_legal_templates: {
        Row: {
          content: Json
          id: string
          template_type: string
          title: Json
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          content?: Json
          id?: string
          template_type: string
          title?: Json
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          content?: Json
          id?: string
          template_type?: string
          title?: Json
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      published_vehicles: {
        Row: {
          badge_finance_available: boolean | null
          badge_hpi_checked: boolean | null
          badge_inspected: boolean | null
          badge_part_exchange: boolean | null
          badge_warranty: boolean | null
          car_job_id: string
          confirmed_trim: string | null
          created_at: string
          dealership_id: string
          details_snapshot: Json
          id: string
          imaging_status: string
          is_published: boolean
          listing_type: string
          manual_photo_pairs: Json
          manual_photo_urls: string[]
          published_at: string | null
          registration_snapshot: string | null
          slots_snapshot: Json
          slug: string
          snapshot_updated_at: string | null
          status_snapshot: string | null
          subscription_id: string
          unpublished_at: string | null
          updated_at: string
        }
        Insert: {
          badge_finance_available?: boolean | null
          badge_hpi_checked?: boolean | null
          badge_inspected?: boolean | null
          badge_part_exchange?: boolean | null
          badge_warranty?: boolean | null
          car_job_id: string
          confirmed_trim?: string | null
          created_at?: string
          dealership_id: string
          details_snapshot?: Json
          id?: string
          imaging_status?: string
          is_published?: boolean
          listing_type?: string
          manual_photo_pairs?: Json
          manual_photo_urls?: string[]
          published_at?: string | null
          registration_snapshot?: string | null
          slots_snapshot?: Json
          slug: string
          snapshot_updated_at?: string | null
          status_snapshot?: string | null
          subscription_id: string
          unpublished_at?: string | null
          updated_at?: string
        }
        Update: {
          badge_finance_available?: boolean | null
          badge_hpi_checked?: boolean | null
          badge_inspected?: boolean | null
          badge_part_exchange?: boolean | null
          badge_warranty?: boolean | null
          car_job_id?: string
          confirmed_trim?: string | null
          created_at?: string
          dealership_id?: string
          details_snapshot?: Json
          id?: string
          imaging_status?: string
          is_published?: boolean
          listing_type?: string
          manual_photo_pairs?: Json
          manual_photo_urls?: string[]
          published_at?: string | null
          registration_snapshot?: string | null
          slots_snapshot?: Json
          slug?: string
          snapshot_updated_at?: string | null
          status_snapshot?: string | null
          subscription_id?: string
          unpublished_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_vehicles_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      special_offers: {
        Row: {
          badge_text: string | null
          created_at: string
          dealership_id: string
          description: string | null
          expires_at: string | null
          id: string
          is_published: boolean
          subscription_id: string
          title: string
          vehicle_id: string | null
        }
        Insert: {
          badge_text?: string | null
          created_at?: string
          dealership_id: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean
          subscription_id: string
          title: string
          vehicle_id?: string | null
        }
        Update: {
          badge_text?: string | null
          created_at?: string
          dealership_id?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_published?: boolean
          subscription_id?: string
          title?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "special_offers_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_members: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_published: boolean
          name: string
          photo_url: string | null
          role: string | null
          sort_order: number
          subscription_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          name: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
          subscription_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          name?: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_menu_prefs: {
        Row: {
          items: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          items?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          items?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_ticket_attachments: {
        Row: {
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          public_url: string | null
          reply_id: string | null
          size_bytes: number | null
          storage_path: string
          ticket_id: string | null
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          reply_id?: string | null
          size_bytes?: number | null
          storage_path: string
          ticket_id?: string | null
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          public_url?: string | null
          reply_id?: string | null
          size_bytes?: number | null
          storage_path?: string
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_attachments_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "support_ticket_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_replies: {
        Row: {
          author_name: string | null
          author_user_id: string | null
          body: string
          created_at: string
          id: string
          is_from_super_admin: boolean
          is_internal_note: boolean
          ticket_id: string
        }
        Insert: {
          author_name?: string | null
          author_user_id?: string | null
          body: string
          created_at?: string
          id?: string
          is_from_super_admin?: boolean
          is_internal_note?: boolean
          ticket_id: string
        }
        Update: {
          author_name?: string | null
          author_user_id?: string | null
          body?: string
          created_at?: string
          id?: string
          is_from_super_admin?: boolean
          is_internal_note?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          dealership_id: string
          id: string
          message: string
          meta_app_version: string | null
          meta_browser: string | null
          meta_page_url: string | null
          meta_user_agent: string | null
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          submitter_email: string
          submitter_name: string
          submitter_phone: string | null
          submitter_user_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          dealership_id: string
          id?: string
          message: string
          meta_app_version?: string | null
          meta_browser?: string | null
          meta_page_url?: string | null
          meta_user_agent?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          submitter_email: string
          submitter_name: string
          submitter_phone?: string | null
          submitter_user_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          dealership_id?: string
          id?: string
          message?: string
          meta_app_version?: string | null
          meta_browser?: string | null
          meta_page_url?: string | null
          meta_user_agent?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          submitter_email?: string
          submitter_name?: string
          submitter_phone?: string | null
          submitter_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_location: string | null
          customer_name: string
          dealership_id: string
          id: string
          is_published: boolean
          quote: string
          rating: number
          subscription_id: string
          vehicle_purchased: string | null
        }
        Insert: {
          created_at?: string
          customer_location?: string | null
          customer_name: string
          dealership_id: string
          id?: string
          is_published?: boolean
          quote: string
          rating?: number
          subscription_id: string
          vehicle_purchased?: string | null
        }
        Update: {
          created_at?: string
          customer_location?: string | null
          customer_name?: string
          dealership_id?: string
          id?: string
          is_published?: boolean
          quote?: string
          rating?: number
          subscription_id?: string
          vehicle_purchased?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_menu_prefs: {
        Row: {
          dealership_id: string | null
          has_customised: boolean
          items: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          dealership_id?: string | null
          has_customised?: boolean
          items?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          dealership_id?: string | null
          has_customised?: boolean
          items?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notification_prefs: {
        Row: {
          email_new_enquiry: boolean
          email_qc_failure: boolean
          email_support_reply: boolean
          in_app_credit_low: boolean
          in_app_new_enquiry: boolean
          in_app_qc_failure: boolean
          in_app_support_reply: boolean
          in_app_vehicle_published: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          email_new_enquiry?: boolean
          email_qc_failure?: boolean
          email_support_reply?: boolean
          in_app_credit_low?: boolean
          in_app_new_enquiry?: boolean
          in_app_qc_failure?: boolean
          in_app_support_reply?: boolean
          in_app_vehicle_published?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          email_new_enquiry?: boolean
          email_qc_failure?: boolean
          email_support_reply?: boolean
          in_app_credit_low?: boolean
          in_app_new_enquiry?: boolean
          in_app_qc_failure?: boolean
          in_app_support_reply?: boolean
          in_app_vehicle_published?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_events: {
        Row: {
          actor: string | null
          car_job_id: string
          created_at: string
          dealership_id: string
          detail: Json
          event_type: string
          id: string
          level: string
          message: string
          subscription_id: string | null
        }
        Insert: {
          actor?: string | null
          car_job_id: string
          created_at?: string
          dealership_id: string
          detail?: Json
          event_type: string
          id?: string
          level?: string
          message: string
          subscription_id?: string | null
        }
        Update: {
          actor?: string | null
          car_job_id?: string
          created_at?: string
          dealership_id?: string
          detail?: Json
          event_type?: string
          id?: string
          level?: string
          message?: string
          subscription_id?: string | null
        }
        Relationships: []
      }
      website_analytics: {
        Row: {
          created_at: string
          id: string
          page_path: string
          subscription_id: string
          unique_visitors: number
          view_count: number
          view_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          subscription_id: string
          unique_visitors?: number
          view_count?: number
          view_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          subscription_id?: string
          unique_visitors?: number
          view_count?: number
          view_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_analytics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      website_content_blocks: {
        Row: {
          block_type: string
          content: Json
          id: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          block_type: string
          content?: Json
          id?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          block_type?: string
          content?: Json
          id?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_content_blocks_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      website_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_published: boolean
          page_type: string
          subscription_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          page_type: string
          subscription_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          page_type?: string
          subscription_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_pages_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      website_subscriptions: {
        Row: {
          billing_end: string | null
          billing_start: string | null
          created_at: string
          custom_domain: string | null
          dealership_id: string
          goes_live_at: string | null
          id: string
          is_live: boolean
          preview_token: string | null
          request_ceiling_override: number | null
          slug: string
          status: string
          tier: string
          updated_at: string
          vehicle_limit_override: number | null
        }
        Insert: {
          billing_end?: string | null
          billing_start?: string | null
          created_at?: string
          custom_domain?: string | null
          dealership_id: string
          goes_live_at?: string | null
          id?: string
          is_live?: boolean
          preview_token?: string | null
          request_ceiling_override?: number | null
          slug: string
          status?: string
          tier?: string
          updated_at?: string
          vehicle_limit_override?: number | null
        }
        Update: {
          billing_end?: string | null
          billing_start?: string | null
          created_at?: string
          custom_domain?: string | null
          dealership_id?: string
          goes_live_at?: string | null
          id?: string
          is_live?: boolean
          preview_token?: string | null
          request_ceiling_override?: number | null
          slug?: string
          status?: string
          tier?: string
          updated_at?: string
          vehicle_limit_override?: number | null
        }
        Relationships: []
      }
      website_themes: {
        Row: {
          bg_removal_background_url: string | null
          bg_removal_engine: string | null
          bg_removal_prompt: string | null
          bg_replacement_mode: string
          coming_soon_image_url: string | null
          composite_ground_pct: number | null
          composite_max_height_pct: number | null
          composite_width_pct: number | null
          created_at: string
          default_aspect_ratio: string
          default_backdrop_id: string | null
          default_badge_finance_available: boolean
          default_badge_hpi_checked: boolean
          default_badge_inspected: boolean
          default_badge_part_exchange: boolean
          default_badge_warranty: boolean
          facebook_url: string | null
          finance_calculator_enabled: boolean
          finance_deposit_pct_override: number | null
          finance_rate_override: number | null
          finance_term_override: number | null
          font_body: string
          font_heading: string
          google_maps_address: string | null
          hero_headline: string | null
          hero_image_url: string | null
          hero_subline: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          page_order: Json
          primary_color: string
          secondary_color: string
          seo_description: string | null
          seo_title: string | null
          show_about: boolean
          show_aftersales: boolean
          show_blog: boolean
          show_careers: boolean
          show_contact: boolean
          show_finance: boolean
          show_finance_calculator: boolean
          show_franchise_logos: boolean
          show_gallery: boolean
          show_new_cars: boolean
          show_part_exchange: boolean
          show_special_offers: boolean
          show_staff_team: boolean
          show_testimonials: boolean
          show_used_cars: boolean
          show_whatsapp_button: boolean
          show_why_choose_us: boolean
          subscription_id: string
          template: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          bg_removal_background_url?: string | null
          bg_removal_engine?: string | null
          bg_removal_prompt?: string | null
          bg_replacement_mode?: string
          coming_soon_image_url?: string | null
          composite_ground_pct?: number | null
          composite_max_height_pct?: number | null
          composite_width_pct?: number | null
          created_at?: string
          default_aspect_ratio?: string
          default_backdrop_id?: string | null
          default_badge_finance_available?: boolean
          default_badge_hpi_checked?: boolean
          default_badge_inspected?: boolean
          default_badge_part_exchange?: boolean
          default_badge_warranty?: boolean
          facebook_url?: string | null
          finance_calculator_enabled?: boolean
          finance_deposit_pct_override?: number | null
          finance_rate_override?: number | null
          finance_term_override?: number | null
          font_body?: string
          font_heading?: string
          google_maps_address?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subline?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          page_order?: Json
          primary_color?: string
          secondary_color?: string
          seo_description?: string | null
          seo_title?: string | null
          show_about?: boolean
          show_aftersales?: boolean
          show_blog?: boolean
          show_careers?: boolean
          show_contact?: boolean
          show_finance?: boolean
          show_finance_calculator?: boolean
          show_franchise_logos?: boolean
          show_gallery?: boolean
          show_new_cars?: boolean
          show_part_exchange?: boolean
          show_special_offers?: boolean
          show_staff_team?: boolean
          show_testimonials?: boolean
          show_used_cars?: boolean
          show_whatsapp_button?: boolean
          show_why_choose_us?: boolean
          subscription_id: string
          template?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          bg_removal_background_url?: string | null
          bg_removal_engine?: string | null
          bg_removal_prompt?: string | null
          bg_replacement_mode?: string
          coming_soon_image_url?: string | null
          composite_ground_pct?: number | null
          composite_max_height_pct?: number | null
          composite_width_pct?: number | null
          created_at?: string
          default_aspect_ratio?: string
          default_backdrop_id?: string | null
          default_badge_finance_available?: boolean
          default_badge_hpi_checked?: boolean
          default_badge_inspected?: boolean
          default_badge_part_exchange?: boolean
          default_badge_warranty?: boolean
          facebook_url?: string | null
          finance_calculator_enabled?: boolean
          finance_deposit_pct_override?: number | null
          finance_rate_override?: number | null
          finance_term_override?: number | null
          font_body?: string
          font_heading?: string
          google_maps_address?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subline?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          page_order?: Json
          primary_color?: string
          secondary_color?: string
          seo_description?: string | null
          seo_title?: string | null
          show_about?: boolean
          show_aftersales?: boolean
          show_blog?: boolean
          show_careers?: boolean
          show_contact?: boolean
          show_finance?: boolean
          show_finance_calculator?: boolean
          show_franchise_logos?: boolean
          show_gallery?: boolean
          show_new_cars?: boolean
          show_part_exchange?: boolean
          show_special_offers?: boolean
          show_staff_team?: boolean
          show_testimonials?: boolean
          show_used_cars?: boolean
          show_whatsapp_button?: boolean
          show_why_choose_us?: boolean
          subscription_id?: string
          template?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_themes_default_backdrop_id_fkey"
            columns: ["default_backdrop_id"]
            isOneToOne: false
            referencedRelation: "backdrops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_themes_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "website_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_admin_dealership: {
        Args: { _dealership_id: string }
        Returns: boolean
      }
      can_write_dealership: {
        Args: { _dealership_id: string }
        Returns: boolean
      }
      can_write_subscription: {
        Args: { _subscription_id: string }
        Returns: boolean
      }
      claim_imaging_quota: {
        Args: {
          p_car_job_id: string
          p_kind?: string
          p_requests: number
          p_subscription_id: string
        }
        Returns: Json
      }
      current_user_dealership_ids: { Args: never; Returns: string[] }
      current_user_in_dealership: {
        Args: { target_dealership_id: string }
        Returns: boolean
      }
      current_user_is_super_admin: { Args: never; Returns: boolean }
      current_user_owns_subscription: {
        Args: { target_subscription_id: string }
        Returns: boolean
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_imaging_usage: { Args: { p_dealership_id: string }; Returns: Json }
      get_subscription_by_preview_token: {
        Args: { token: string }
        Returns: Json
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      imaging_month: { Args: { p_at?: string }; Returns: string }
      is_active_member: { Args: { _dealership_id: string }; Returns: boolean }
      is_dealership_admin: {
        Args: { _dealership_id: string }
        Returns: boolean
      }
      log_vehicle_event_v1: {
        Args: {
          p_car_job_id: string
          p_detail?: Json
          p_event_type: string
          p_level?: string
          p_message: string
        }
        Returns: string
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      seed_sell_your_car_blocks: {
        Args: { _subscription_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
