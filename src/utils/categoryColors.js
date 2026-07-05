const defaultCategoryColors = {
  Food: '#3b82f6',
  Travel: '#f97316',
  Shopping: '#a855f7',
  Bills: '#06b6d4',
  Medical: '#ef4444',
  Entertainment: '#22c55e',
  Other: '#64748b',
}

export const getCategoryColor = (category) => {
  if (defaultCategoryColors[category]) {
    return defaultCategoryColors[category]
  }

  // Generate consistent color for custom categories using hash
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

export const getAllCategoryColors = (categories) => {
  return categories.reduce((acc, category) => {
    acc[category] = getCategoryColor(category)
    return acc
  }, {})
}
