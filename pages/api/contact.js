// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json(
    { 
      name: 'Zeus-The-Cat',
      hobbies: 'Guitar, Cooking, Art Walks, Hiking, Video Games, Foodie'
    })
}
