// utils/tableParser.ts
import { Project, PropertySignature, TypeLiteralNode, SyntaxKind } from "ts-morph";

// Structure to store attributes, including potential enum values and relationship details
export interface AttributeWithEnum {
  name: string;
  type: string;
  enumValues?: string[]; // Optional property for enum values
}

// Structure for relationships
export interface Relationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  tableReferenced: string;
  attributesReferenced: string[];
}

// Structure for table attributes
export interface TableAttributes {
  tableName: string;
  attributes: AttributeWithEnum[];
  relationships: Relationship[]; // New property for relationships
}

/**
 * Parses TypeScript file content and extracts table names with their attributes and types.
 * @param tsFileContent The TypeScript file content to analyze
 * @returns An array of objects containing table names and their attributes with types
 */
export const parseSupabaseTablesWithAttributes = (tsFileContent: string): TableAttributes[] => {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("temp.ts", tsFileContent);
  const typeChecker = project.getTypeChecker();

  const databaseType = sourceFile.getTypeAliasOrThrow("Database");
  const databaseNode = databaseType.getTypeNodeOrThrow() as TypeLiteralNode;

  const publicProp = databaseNode.getPropertyOrThrow("public");
  const publicTypeNode = publicProp.getTypeNodeOrThrow() as TypeLiteralNode;

  const tablesProp = publicTypeNode.getPropertyOrThrow("Tables");
  const tablesTypeNode = tablesProp.getTypeNodeOrThrow() as TypeLiteralNode;

  const tablesWithAttributes: TableAttributes[] = tablesTypeNode
    .getMembers()
    .filter((member) => member instanceof PropertySignature)
    .map((member) => {
      const tableName = (member as PropertySignature).getName();
      const memberType = (member as PropertySignature).getTypeNodeOrThrow() as TypeLiteralNode;
      const rowProp = memberType.getPropertyOrThrow("Row");
      const rowTypeNode = rowProp.getTypeNodeOrThrow() as TypeLiteralNode;

      const attributes = rowTypeNode
        .getMembers()
        .filter((field) => field instanceof PropertySignature)
        .map((field) => {
          const name = (field as PropertySignature).getName();
          const fieldType = (field as PropertySignature).getType();
          const fieldTypeText = fieldType.getText();

          // Check for union types with string literals
          let enumValues: string[] | undefined;
          if (fieldType.isUnion()) {
            // Retrieve all union members and check if they are string literals
            enumValues = fieldType
              .getUnionTypes()
              .map((unionType) => unionType.getText())
              .filter((value) => value.startsWith('"') && value.endsWith('"'))
              .map((value) => value.replace(/"/g, "")); // Remove surrounding quotes
          }

          const attribute: AttributeWithEnum = {
            name,
            type: fieldTypeText,
            enumValues,
          };

          return attribute;
        });

      // Parse relationships
      const relationshipsProp = memberType.getPropertyOrThrow("Relationships");
      let relationships: Relationship[] = [];
      const relationshipsArray = relationshipsProp.getTypeNodeOrThrow().forEachChildAsArray();
      relationshipsArray.forEach((relationshipNode) => {
        const relationshipType = typeChecker.getTypeAtLocation(relationshipNode);

        const getPropertyValue = (propName: string) => {
          const prop = relationshipType.getProperty(propName);
          if (!prop) return undefined;
          const valueDeclaration = prop.getValueDeclaration();
          if (!valueDeclaration) return undefined;
          const propType = typeChecker.getTypeAtLocation(valueDeclaration);
          return propType.getText().replace(/"/g, "");
        };

        const foreignKeyName = getPropertyValue("foreignKeyName");
        const columnsText = getPropertyValue("columns");
        const isOneToOne = getPropertyValue("isOneToOne") === "true";
        const referencedRelation = getPropertyValue("referencedRelation");
        const referencedColumnsText = getPropertyValue("referencedColumns");

        const columns = columnsText ? columnsText.replace(/^\[(.*)\]$/, "$1").split(", ") : [];
        const referencedColumns = referencedColumnsText ? referencedColumnsText.replace(/^\[(.*)\]$/, "$1").split(", ") : [];

        if (foreignKeyName && columns.length && referencedRelation && referencedColumns.length) {
          relationships.push({
            foreignKeyName,
            columns,
            isOneToOne,
            tableReferenced: referencedRelation,
            attributesReferenced: referencedColumns,
          });
        }
      });

      return { tableName, attributes, relationships };
    });

  return tablesWithAttributes;
};
