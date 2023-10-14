/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import AWS from 'aws-sdk';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '$env/static/private';

AWS.config.update({ region: AWS_REGION })

AWS.config.credentials = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
}

let s3 = new AWS.S3(); // default to latest API version.

export async function uploadObject(bucket: string, key: string, fileBuffer: Buffer): Promise<AWS.S3.ManagedUpload.SendData> {
    return new Promise(async (resolve, reject) => {
        s3.upload({
            Bucket: bucket,
            Key: key,
            Body: fileBuffer
        }, function(err: Error, data: AWS.S3.ManagedUpload.SendData) {
            if(err) {
                reject(err)
                console.error(err)
            }
            resolve(data)
        })
    })
}

export async function getObject(bucket: string, key: string): Promise<AWS.S3.GetObjectOutput> {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: bucket,
            Key: key
        }, function(err: Error, data: AWS.S3.GetObjectOutput) {
            if(err) {
                reject(err)
                console.error(err)
            } else resolve(data)
        })
    })
}

export async function deleteObject(bucket: string, key: string): Promise<AWS.S3.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: bucket,
            Key: key,
        }, function(err: Error, data: AWS.S3.DeleteObjectOutput) {
            if(err) {
                reject(err)
                console.error(err)
            } else resolve(data)
        })
    })
}