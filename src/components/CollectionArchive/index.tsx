'use client'

import React from 'react'

interface CollectionArchiveProps {
  posts?: any[]
}

export const CollectionArchive: React.FC<CollectionArchiveProps> = ({ posts = [] }) => {
  if (!posts || posts.length === 0) {
    return <div>No posts found</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post, index) => (
        <div key={post?.id || index} className="p-4 border rounded">
          <h3>{post?.title || 'Untitled'}</h3>
        </div>
      ))}
    </div>
  )
}
