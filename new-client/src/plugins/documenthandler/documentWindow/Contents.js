import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import ImagePopupModal from "./ImagePopupModal";
import htmlToMaterialUiParser from "../utils/htmlToMaterialUiParser";
import {
  Paragraph,
  ULComponent,
  OLComponent,
  Link,
  Figure,
  Heading,
  Strong,
  Italic,
  Underline,
  Img,
  BlockQuote,
} from "../utils/ContentComponentFactory";

const styles = (theme) => {
  return {
    typography: {
      overflowWrap: "break-word",
    },
    chapter: {
      cursor: "text",
      marginTop: theme.spacing(4),
    },
  };
};

class Contents extends React.PureComponent {
  state = {
    popupImage: null,
    activeContent: null,
  };

  componentDidMount = () => {
    this.appendParsedComponentsToDocument();
    this.props.localObserver.unsubscribe("append-chapter-components");
    this.props.localObserver.subscribe("image-popup", this.showPopupModal);
    this.props.localObserver.subscribe(
      "append-chapter-components",
      (chapters) => {
        chapters.forEach((chapter) => {
          this.appendComponentsToChapter(chapter);
        });
        let renderedChapters = this.renderChapters(chapters);
        this.props.localObserver.publish(
          "chapter-components-appended",
          renderedChapters
        );
      }
    );
  };

  componentWillUnmount = () => {
    this.props.localObserver.unsubscribe("chapter-components-appended");
  };

  /**
   * Private help method that adds all allowed html tags.
   *
   * @memberof Contents
   */
  getTagSpecificCallbacks = () => {
    let allowedHtmlTags = [];
    allowedHtmlTags.push({
      tagType: "br",
      callback: this.props.contentComponentFactory.getBrtagTypographyComponent,
    });
    allowedHtmlTags.push({
      tagType: "ul",
      callback: (e) => {
        return <ULComponent ulComponent={e}></ULComponent>;
      },
    });
    allowedHtmlTags.push({
      tagType: "ol",
      callback: () => <OLComponent></OLComponent>,
    });
    allowedHtmlTags.push({
      tagType: "li",
      callback: () => {},
    });
    allowedHtmlTags.push({
      tagType: "blockquote",
      callback: () => {
        return <BlockQuote></BlockQuote>;
      },
    });
    allowedHtmlTags.push({
      tagType: "h1",
      callback: () => {
        return <Heading></Heading>;
      },
    });
    allowedHtmlTags.push({
      tagType: "h2",
      callback: () => {
        return <Heading></Heading>;
      },
    });
    allowedHtmlTags.push({
      tagType: "h3",
      callback: () => {
        return <Heading></Heading>;
      },
    });
    allowedHtmlTags.push({
      tagType: "h4",
      callback: () => {
        return <Heading></Heading>;
      },
    });
    allowedHtmlTags.push({
      tagType: "h5",
      callback: () => {
        return <Heading></Heading>;
      },
    });
    allowedHtmlTags.push({
      tagType: "h6",
      callback: () => {
        return <Heading></Heading>;
      },
    });
    allowedHtmlTags.push({
      tagType: "a",
      callback: () => {
        return <Link></Link>;
      },
    });
    allowedHtmlTags.push({
      tagType: "img",
      callback: () => {
        return <Img></Img>;
      },
    });
    allowedHtmlTags.push({
      tagType: "p",
      callback: (e) => {
        return <Paragraph pTag={e}></Paragraph>;
      },
    });
    allowedHtmlTags.push({
      tagType: "figure",
      callback: () => {
        return <Figure></Figure>;
      },
    });
    allowedHtmlTags.push({
      tagType: "strong",
      callback: () => {
        return <Strong></Strong>;
      },
    });
    allowedHtmlTags.push({
      tagType: "u",
      callback: () => {
        return <Underline></Underline>;
      },
    });
    allowedHtmlTags.push({
      tagType: "em",
      callback: () => {
        return <Italic></Italic>;
      },
    });
    return allowedHtmlTags;
  };

  getMaterialUIComponentsForChapter = (chapter) => {
    return htmlToMaterialUiParser(
      chapter.html,
      this.getTagSpecificCallbacks()
    ).map((component, index) => {
      return <React.Fragment key={index}>{component}</React.Fragment>;
    });
  };

  appendComponentsToChapter = (chapter) => {
    if (chapter.chapters && chapter.chapters.length > 0) {
      chapter.chapters.forEach((subChapter) => {
        subChapter.components = this.getMaterialUIComponentsForChapter(
          subChapter
        );
        if (subChapter.chapters && subChapter.chapters.length > 0) {
          this.appendComponentsToChapter(subChapter);
        }
      });
    }
    chapter.components = this.getMaterialUIComponentsForChapter(chapter);
  };

  appendParsedComponentsToDocument = () => {
    const { activeDocument } = this.props;
    let content = { ...activeDocument };
    content.chapters.forEach((chapter, index) => {
      this.appendComponentsToChapter(chapter);
    });
    this.setState({ activeContent: content });
  };

  componentDidUpdate(nextProps) {
    const { activeDocument } = this.props;
    if (nextProps.activeDocument !== activeDocument) {
      this.appendParsedComponentsToDocument();
    }
  }

  closePopupModal = () => {
    this.setState({ popupImage: null });
  };

  showPopupModal = (image) => {
    console.log(image, "image");
    this.setState({ popupImage: image });
  };

  renderImageInModal = () => {
    const { popupImage } = this.state;

    return (
      <ImagePopupModal
        open={popupImage == null ? false : true}
        close={this.closePopupModal}
        image={popupImage}
      ></ImagePopupModal>
    );
  };

  /**
   * Renders the document with all it's chapters and sub chapters.
   * @param {object} document The document that will be rendered.
   *
   * @memberof Contents
   */
  renderChapters = (chapters) => {
    return Array.isArray(chapters)
      ? chapters.map((chapter) => this.renderChapter(chapter))
      : null;
  };

  /**
   * Renders a chapter with a headline an a content.
   * @param {object} chapter The chapter to be rendered.
   *
   * @memberof Contents
   */
  renderChapter = (chapter) => {
    const { classes } = this.props;
    return (
      <Grid
        className={classes.chapter}
        container
        item
        alignItems="center"
        key={chapter.id}
      >
        <Grid item xs={12}>
          {this.renderHeadline(chapter)}
        </Grid>
        <Grid item xs={12}>
          {chapter.components}
        </Grid>
        {Array.isArray(chapter.chapters)
          ? chapter.chapters.map((subChapter) => this.renderChapter(subChapter))
          : null}
      </Grid>
    );
  };

  getHeaderVariant = (chapter) => {
    let headerSize = 2; //Chapters start with h2
    while (chapter.parent) {
      headerSize++;
      chapter = chapter.parent;
    }
    return `h${headerSize}`;
  };

  /**
   * Render the headline of a chapter.
   * @param {object} chapter The chapter to be rendered.
   *
   * @memberof Contents
   */
  renderHeadline = (chapter) => {
    const { classes } = this.props;

    return (
      <>
        <Typography
          ref={chapter.scrollRef}
          className={classes.typography}
          id="chapter-header"
          variant={this.getHeaderVariant(chapter)}
        >
          {chapter.header}
        </Typography>
      </>
    );
  };

  render = () => {
    if (this.state.activeContent) {
      return (
        <>
          {this.renderImageInModal()}
          {this.renderChapters(this.state.activeContent.chapters)}
        </>
      );
    } else {
      return null;
    }
  };
}

export default withStyles(styles)(Contents);
