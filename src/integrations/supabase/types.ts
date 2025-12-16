/**
 * Supabase Database Type Definitions
 * 
 * Ez a fájl típusbiztos interfészeket biztosít a Supabase adatbázishoz.
 * Automatikusan generált típusok támogatásával segíti a fejlesztést.
 * 
 * @packageDocumentation
 */

/**
 * JSON típusok, amelyeket a Supabase adatbázis támogat.
 * Rekurzív definíció lehetővé teszi beágyazott objektumok kezelését.
 * 
 * @example
 * ```typescript
 * const data: Json = { name: "John", age: 30, tags: ["developer", "typescript"] };
 * ```
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Belső konfigurációs típus a Supabase kliens automatikus típusellenőrzéséhez.
 * Nem kell közvetlenül használni.
 * 
 * @internal
 */
type InternalSupabaseConfig = {
  PostgrestVersion: "14.1"
}

/**
 * Adatbázis séma definíció.
 * Tartalmazza a táblákat, view-kat, függvényeket, enum-okat és kompozit típusokat.
 * 
 * @template TSchema - Az adatbázis séma neve (alapértelmezett: "public")
 */
export type DatabaseSchema = {
  Tables: Record<string, TableDefinition>
  Views: Record<string, ViewDefinition>
  Functions: Record<string, FunctionDefinition>
  Enums: Record<string, string>
  CompositeTypes: Record<string, unknown>
}

/**
 * Tábla definíció szerkezete.
 * Minden táblának van Row, Insert és Update típusa.
 */
type TableDefinition = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
}

/**
 * View definíció szerkezete.
 * A view-k csak olvashatók, nincs Insert/Update.
 */
type ViewDefinition = {
  Row: Record<string, unknown>
}

/**
 * Függvény definíció szerkezete.
 */
type FunctionDefinition = {
  Args: Record<string, unknown>
  Returns: unknown
}

/**
 * Fő adatbázis típus.
 * Tartalmazza az összes sémát és a belső konfigurációt.
 * 
 * @example
 * ```typescript
 * // Használat Supabase klienssel
 * import { createClient } from '@supabase/supabase-js';
 * import type { Database } from './types';
 * 
 * const supabase = createClient<Database>(
 *   process.env.SUPABASE_URL!,
 *   process.env.SUPABASE_ANON_KEY!
 * );
 * ```
 */
export type Database = {
  __InternalSupabase: InternalSupabaseConfig
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * Adatbázis típus belső konfigurációs mezők nélkül.
 * @internal
 */
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

/**
 * Alapértelmezett séma kinyerése az adatbázisból.
 * @internal
 */
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">]

/**
 * Séma vagy táblanév opciók típusa.
 * Vagy egy táblanév string, vagy egy objektum séma specifikációval.
 * 
 * @internal
 */
type SchemaTableOptions<TSchema extends keyof DatabaseWithoutInternals> =
  | keyof (DatabaseWithoutInternals[TSchema]["Tables"] & DatabaseWithoutInternals[TSchema]["Views"])
  | { schema: keyof DatabaseWithoutInternals }

/**
 * Táblanév kinyerése a séma opcióból.
 * @internal
 */
type ExtractTableName<
  TOptions extends SchemaTableOptions<any>,
  TSchema extends keyof DatabaseWithoutInternals
> = TOptions extends { schema: keyof DatabaseWithoutInternals }
  ? keyof (DatabaseWithoutInternals[TOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[TOptions["schema"]]["Views"])
  : never

/**
 * Row típus kinyerése táblából vagy view-ból.
 * @internal
 */
type GetRowType<TSchema extends DatabaseSchema, TTableName extends keyof (TSchema["Tables"] & TSchema["Views"])> =
  (TSchema["Tables"] & TSchema["Views"])[TTableName] extends { Row: infer R } ? R : never

/**
 * Insert típus kinyerése táblából.
 * @internal
 */
type GetInsertType<TSchema extends DatabaseSchema, TTableName extends keyof TSchema["Tables"]> =
  TSchema["Tables"][TTableName] extends { Insert: infer I } ? I : never

/**
 * Update típus kinyerése táblából.
 * @internal
 */
type GetUpdateType<TSchema extends DatabaseSchema, TTableName extends keyof TSchema["Tables"]> =
  TSchema["Tables"][TTableName] extends { Update: infer U } ? U : never

/**
 * Tábla sor (Row) típusának lekérdezése.
 * Támogatja mind az alapértelmezett, mind az egyedi sémákat.
 * 
 * @template TTableNameOrOptions - Táblanév vagy { schema: string } objektum
 * @template TTableName - Táblanév az egyedi séma esetén
 * 
 * @example
 * ```typescript
 * // Alapértelmezett séma (public)
 * type User = Tables<"users">;
 * 
 * // Egyedi séma
 * type AdminUser = Tables<{ schema: "admin" }, "users">;
 * ```
 */
export type Tables<
  TTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TTableName extends TTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? ExtractTableName<TTableNameOrOptions, TTableNameOrOptions["schema"]>
    : never = never,
> = TTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? GetRowType<
      DatabaseWithoutInternals[TTableNameOrOptions["schema"]],
      TTableName
    >
  : TTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? GetRowType<DefaultSchema, TTableNameOrOptions>
    : never

/**
 * Tábla beszúrási (Insert) típusának lekérdezése.
 * Csak táblákhoz használható, view-khoz nem.
 * 
 * @template TTableNameOrOptions - Táblanév vagy { schema: string } objektum
 * @template TTableName - Táblanév az egyedi séma esetén
 * 
 * @example
 * ```typescript
 * // Új felhasználó beszúrása
 * const newUser: TablesInsert<"users"> = {
 *   email: "user@example.com",
 *   name: "John Doe"
 * };
 * 
 * await supabase.from("users").insert(newUser);
 * ```
 */
export type TablesInsert<
  TTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TTableName extends TTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[TTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = TTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? GetInsertType<
      DatabaseWithoutInternals[TTableNameOrOptions["schema"]],
      TTableName
    >
  : TTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? GetInsertType<DefaultSchema, TTableNameOrOptions>
    : never

/**
 * Tábla frissítési (Update) típusának lekérdezése.
 * Az Update típus általában minden mező opcionális.
 * 
 * @template TTableNameOrOptions - Táblanév vagy { schema: string } objektum
 * @template TTableName - Táblanév az egyedi séma esetén
 * 
 * @example
 * ```typescript
 * // Felhasználó frissítése
 * const updates: TablesUpdate<"users"> = {
 *   name: "Jane Doe"
 * };
 * 
 * await supabase.from("users").update(updates).eq("id", userId);
 * ```
 */
export type TablesUpdate<
  TTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TTableName extends TTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[TTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = TTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? GetUpdateType<
      DatabaseWithoutInternals[TTableNameOrOptions["schema"]],
      TTableName
    >
  : TTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? GetUpdateType<DefaultSchema, TTableNameOrOptions>
    : never

/**
 * Enum típusának lekérdezése.
 * 
 * @template TEnumNameOrOptions - Enum név vagy { schema: string } objektum
 * @template TEnumName - Enum név az egyedi séma esetén
 * 
 * @example
 * ```typescript
 * type UserRole = Enums<"user_role">; // "admin" | "user" | "guest"
 * ```
 */
export type Enums<
  TEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  TEnumName extends TEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[TEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = TEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[TEnumNameOrOptions["schema"]]["Enums"][TEnumName]
  : TEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][TEnumNameOrOptions]
    : never

/**
 * Kompozit típus lekérdezése.
 * A kompozit típusok összetett adatstruktúrák PostgreSQL-ben.
 * 
 * @template TCompositeNameOrOptions - Kompozit típus név vagy { schema: string } objektum
 * @template TCompositeName - Kompozit típus név az egyedi séma esetén
 * 
 * @example
 * ```typescript
 * type Address = CompositeTypes<"address">;
 * ```
 */
export type CompositeTypes<
  TCompositeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  TCompositeName extends TCompositeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[TCompositeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = TCompositeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[TCompositeNameOrOptions["schema"]]["CompositeTypes"][TCompositeName]
  : TCompositeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][TCompositeNameOrOptions]
    : never

/**
 * Konstans értékek exportálása.
 * Használható runtime enum ellenőrzéshez.
 * 
 * @example
 * ```typescript
 * const validRoles = Constants.public.Enums.user_role;
 * ```
 */
export const Constants = {
  public: {
    Enums: {},
  },
} as const

/**
 * Típus helper a táblák listázásához.
 * Hasznos ha programmatikusan szeretnéd feldolgozni a tábla neveket.
 * 
 * @example
 * ```typescript
 * type AllTables = TableNames; // "users" | "posts" | ...
 * ```
 */
export type TableNames = keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])

/**
 * Típus helper az enum nevek listázásához.
 * 
 * @example
 * ```typescript
 * type AllEnums = EnumNames; // "user_role" | "status" | ...
 * ```
 */
export type EnumNames = keyof DefaultSchema["Enums"]

/**
 * Függvény paraméterek típusának lekérdezése.
 * 
 * @template TFunctionName - Függvény neve
 * 
 * @example
 * ```typescript
 * type SearchParams = FunctionArgs<"search_users">;
 * await supabase.rpc("search_users", params);
 * ```
 */
export type FunctionArgs<TFunctionName extends keyof DefaultSchema["Functions"]> =
  DefaultSchema["Functions"][TFunctionName] extends { Args: infer A } ? A : never

/**
 * Függvény visszatérési értékének típusa.
 * 
 * @template TFunctionName - Függvény neve
 * 
 * @example
 * ```typescript
 * type SearchResult = FunctionReturns<"search_users">;
 * ```
 */
export type FunctionReturns<TFunctionName extends keyof DefaultSchema["Functions"]> =
  DefaultSchema["Functions"][TFunctionName] extends { Returns: infer R } ? R : never
