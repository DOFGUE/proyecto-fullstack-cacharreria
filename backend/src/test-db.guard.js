export const databaseNameFromUri = (uri) => {
  const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?/#]+)(?:\?.*)?$/)
  if (!match) return null
  return decodeURIComponent(match[1])
}

export const assertTestDatabase = (uri) => {
  const databaseName = databaseNameFromUri(uri)
  if (!databaseName) {
    throw new Error("Test database URI must include an explicit database name.")
  }
  if (!databaseName.endsWith("_test")) {
    throw new Error(`Refusing test operation against database "${databaseName}". Test databases must end exactly in "_test".`)
  }
  return databaseName
}
