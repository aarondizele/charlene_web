const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// Aggregate Likes & Comments on Posts

exports.aggregateLikesCount = functions.firestore
    .document('hearts/{postId}')
    .onWrite(event => {
        const postId = event.data.get('postId')
        // document reference
        const postsRef = admin.firestore().collection('posts').doc(postId)
        const heartsRef = admin.firestore().collection('hearts')
        // get all comments and aggregate   
        heartsRef.where('postId', '==', postId)
            .get()
            .then(doc => {
                // get the total comment count
                const likesCount = doc.size

                return postsRef.update({ likesCount: likesCount })
            })
            .catch(err => console.error(err))
    })