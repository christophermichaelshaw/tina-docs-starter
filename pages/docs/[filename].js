import DocLayout from "../../components/DocLayout";
import { staticRequest, gql } from "tinacms";
import { sideMenuItems } from "../../utils/mdxUtils";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Button } from "../../components";
import FeaturesBlock from "../../blocks/features-block";
import HeroBlock from "../../blocks/hero-block";
import Callout from "../../blocks/callout-block";
import ReactPlayer from "react-player/lazy";
import Page404 from "../404.js";
import { useTina } from "tinacms/dist/edit-state";

const query = gql`
  query DocumentQuery($relativePath: String!) {
    getDocsDocument(relativePath: $relativePath) {
      data {
        title
        body
      }
    }
    getDocsList {
      edges {
        node {
          data {
            title
            section
          }
          sys {
            filename
            collection {
              name
            }
          }
        }
      }
    }
  }
`;

const components = {
  Callout: (props) => {
    return <Callout callout={props} />;
  },
  Button: (props) => {
    return (
      <Button as="a" href={props.url} variant={props.type}>
        {props.text}
      </Button>
    );
  },
  Hero: (props) => {
    return <HeroBlock hero={props} />;
  },
  FeatureSection: (props) => {
    return <FeaturesBlock features={props.featureList} />;
  },
  VideoPlayer: (props) => {
    return <ReactPlayer controls="true" url={props.url} />;
  },
};

function DocPage(props) {
  const { data } = useTina({
    query,
    variables: props.variables,
    data: props.data,
  });

  if (data && data.getDocsDocument) {
    const sideNav = sideMenuItems(data);
    return (
      <DocLayout title={data.getDocsDocument.data.title} navGroups={sideNav}>
        <TinaMarkdown
          components={components}
          content={data.getDocsDocument.data.body}
        />
      </DocLayout>
    );
  } else {
    return <Page404 />;
  }
}
export default DocPage;

export const getStaticProps = async ({ params }) => {
  const variables = { relativePath: `${params.filename}.mdx` };

  let data = {};
  try {
    data = await staticRequest({
      query,
      variables,
    });
  } catch (error) {
    // swallow errors related to document creation
  }

  return {
    props: {
      variables,
      data,
    },
  };
};

export const getStaticPaths = async () => {
  const docsListData = await staticRequest({
    query: `#graphql
      {
        getDocsList {
          edges {
            node {
              sys {
                filename
              }
            }
          }
        }
      }
    `,
    variables: {},
  });
  return {
    paths:
      docsListData?.getDocsList?.edges?.map((doc) => ({
        params: { filename: doc.node.sys.filename },
      })) || [],
    fallback: "blocking",
  };
};
