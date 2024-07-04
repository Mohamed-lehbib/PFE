import { createProjectClient } from "@/utils/supabase/client";

export const fetchTableData = async (
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  tableName: string,
  attributes: any[],
  searchField: string,
  searchValue: string
) => {
  const supabase = createProjectClient(supabaseUrl, supabaseServiceRoleKey);
  let query = supabase
    .from(tableName)
    .select(attributes.filter((attr) => attr.read).map((attr) => attr.name).join(", "))
    .order("id", { ascending: false });

  if (searchField && searchValue) {
    const attribute = attributes.find((attr) => attr.name === searchField);

    if (attribute) {
      if (attribute.type === "string") {
        query = query.ilike(searchField, `%${searchValue}%`);
      } else {
        query = query.eq(searchField, searchValue);
      }
    }
  }

  const { data, error } = await query;
  return { data: data || [], error };
};
