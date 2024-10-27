import Link from 'next/link';

type PostHeadingProps = {
  title: string;
  id?: string;
  isSinglePost?: boolean;
};

const Title = ({ title, id, isSinglePost }: PostHeadingProps) =>
  isSinglePost ? (
    <>{title}</>
  ) : (
    <Link href={`/posts/${id}`} className="text-blue-600 hover:underline">
      {title}
    </Link>
  );

const PostHeading = ({ title, id, isSinglePost }: PostHeadingProps) => (
  <h2 className="text-lg font-medium" data-testid="post-title">
    <Title title={title} id={id} isSinglePost={isSinglePost} />
  </h2>
);

export { PostHeading };
