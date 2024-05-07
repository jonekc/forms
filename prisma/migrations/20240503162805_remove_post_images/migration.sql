-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_postId_fkey";

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
