import mongoose,{Schema} from 'mongoose';

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true // URL to the thumbnail image
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // Duration in seconds Cloudnary will return this
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    }

},
{
    timestamps: true
})

videoSchema.plugin(moongooseAggregatePaginate); // Plugin for pagination

export const Video = mongoose.model('Video', videoSchema);