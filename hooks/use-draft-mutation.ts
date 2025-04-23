import { useMutation } from "@apollo/client";
import { ADD_OR_UPDATE_DRAFT } from "@/lib/graphql/mutations";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { toast } from "sonner";
import { useRef } from "react";
import { DraftInput } from "@/lib/graphql/types";
import { debounce } from "lodash";

export function useDraftMutation() {
  const { user } = useUserProfileStore();
  const [mutate] = useMutation(ADD_OR_UPDATE_DRAFT, {
    update(cache, { data: { addOrUpdateDraft } }) {
      // Update the cache with the new draft data including updated_Date
      cache.modify({
        fields: {
          draftByUserId(existingDrafts = []) {
            const newDraft = {
              ...addOrUpdateDraft,
              __typename: "Draft",
            };
            return [newDraft, ...existingDrafts];
          },
        },
      });
    },
  });
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedMutation = debounce(
    async (draftData: Omit<DraftInput, "userId">) => {
      if (!user?.userId) {
        toast.error("User ID not found");
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          await mutate({
            variables: {
              draft: {
                ...draftData,
                userId: user.userId,
              },
            },
          });
          toast.success("Draft saved successfully");
        } catch (error) {
          console.error("Error saving draft:", error);
          toast.error("Failed to save draft");
        }
      }, 1000);
    },
    [mutate, user?.userId]
  );

  return debouncedMutation;
}
