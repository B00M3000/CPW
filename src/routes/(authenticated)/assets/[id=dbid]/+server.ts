import { AssetSchema, type AssetDocument } from '@/server/mongo/schemas/asset'
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ params: { id }, url, setHeaders }) {
    const asset = await AssetSchema.findById(id);   

    if(!asset) throw error(404, "No Asset found with that ID");

    setHeaders({
        "cache-control": "max-age=1209600", // two weeks cache
    });

    return new Response(asset.data, { status: 200, headers: { "Content-Type": asset.contentType }})
}

export async function DELETE({ params: { id }}) {
    const res = await AssetSchema.deleteOne({ _id: id });
    ProjectSchema.findOneAndUpdate({}, { $pull: { imageIds: { $in: [ id ]} } })
    return json({ message: "Asset has been deleted sucessfully!"}, { status: 200 });
}